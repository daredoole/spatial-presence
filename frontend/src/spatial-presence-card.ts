import { LitElement, css, html, nothing, svg } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";

import {
  loadStoredMap,
  restoreStoredMap,
  saveStoredMap,
  toPortableMap,
} from "./backend";
import { runtimeForFloor } from "./discovery";
import {
  exportEasyFloorplan,
  importEasyFloorplan,
  importRadarMapManager,
} from "./interoperability";
import {
  clientToFloorPoint,
  coverageSectorPath,
  normalizeHeading,
  pointsAttribute,
  zoomViewBox,
} from "./geometry";
import type {
  Floor,
  HomeAssistant,
  PathFeature,
  Point,
  RadarRuntime,
  RadarSensor,
  RadarTarget,
  SpatialPresenceConfig,
  ViewBox,
} from "./types";

const CARD_VERSION = "0.1.0-alpha.2";

type DrawingTool = "pan" | "wall" | "room" | "zone";
type DragState =
  | { kind: "pan"; clientX: number; clientY: number; view: ViewBox }
  | { kind: "sensor"; sensorId: string };

const EMPTY_HASS: HomeAssistant = { states: {} };

export class SpatialPresenceCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    editorMode: { attribute: false },
    _config: { state: true },
    _storageStatus: { state: true },
    _floorId: { state: true },
    _view: { state: true },
    _selectedSensorId: { state: true },
    _tool: { state: true },
    _draftPoints: { state: true },
    _showCoverage: { state: true },
    _showTrails: { state: true },
  };

  hass: HomeAssistant = EMPTY_HASS;
  editorMode = false;
  private _config?: SpatialPresenceConfig;
  private _floorId = "";
  private _view: ViewBox = { x: 0, y: 0, width: 1200, height: 800 };
  private _selectedSensorId: string | undefined;
  private _tool: DrawingTool = "pan";
  private _draftPoints: Point[] = [];
  private _showCoverage = true;
  private _showTrails = true;
  private _drag: DragState | undefined;
  private _pointerMoved = false;
  private _trails = new Map<string, RadarTarget[]>();

  static getConfigElement(): HTMLElement {
    return document.createElement("spatial-presence-card-editor");
  }

  static getStubConfig(): Omit<SpatialPresenceConfig, "type"> {
    return {
      schema_version: "0.1",
      title: "Spatial presence",
      auto_discover: true,
      target_trail_seconds: 8,
      floors: [defaultFloor()],
    };
  }

  setConfig(config: SpatialPresenceConfig): void {
    if (!Array.isArray(config.floors) || config.floors.length === 0) {
      throw new Error("Add at least one floor to Spatial Presence.");
    }
    this._config = normalizeConfig(config);
    const requested = config.default_floor;
    if (!this._floorId || !this._config.floors.some((floor) => floor.id === this._floorId)) {
      this._floorId =
        (requested && this._config.floors.some((floor) => floor.id === requested)
          ? requested
          : this._config.floors[0]?.id) ?? "";
      this._fit();
    }
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions(): { rows: number; columns: number; min_rows: number } {
    return { rows: 8, columns: 12, min_rows: 4 };
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("hass")) this._captureTrails();
  }

  protected render(): TemplateResult {
    const config = this._config;
    const floor = this._floor;
    if (!config || !floor) {
      return html`<ha-card><p class="empty">Add a floor to begin.</p></ha-card>`;
    }

    const runtimes = runtimeForFloor(
      this.hass,
      floor,
      config.auto_discover !== false,
    );
    const selected = runtimes.find(
      (runtime) => runtime.sensor.id === this._selectedSensorId,
    );

    return html`
      <ha-card>
        <section class="shell" aria-label=${config.title ?? "Spatial presence"}>
          ${this._renderToolbar(config, floor)}
          <div class="workspace">
            ${this._renderMap(floor, runtimes)}
            ${selected ? this._renderInspector(selected, floor) : nothing}
          </div>
          ${this.editorMode ? this._renderEditorHint() : nothing}
        </section>
      </ha-card>
    `;
  }

  private _renderToolbar(
    config: SpatialPresenceConfig,
    floor: Floor,
  ): TemplateResult {
    return html`
      <header class="toolbar">
        <label class="floor-select">
          <span class="sr-only">Floor</span>
          <select @change=${this._changeFloor} .value=${floor.id}>
            ${config.floors.map(
              (entry) => html`<option value=${entry.id}>${entry.name}</option>`,
            )}
          </select>
        </label>
        <div class="toolbar-actions">
          <button type="button" @click=${this._fit} title="Fit entire floor">Fit</button>
          <button
            type="button"
            class=${this._showCoverage ? "active" : ""}
            @click=${() => (this._showCoverage = !this._showCoverage)}
            aria-pressed=${this._showCoverage}
          >Coverage</button>
          <button
            type="button"
            class=${this._showTrails ? "active" : ""}
            @click=${() => (this._showTrails = !this._showTrails)}
            aria-pressed=${this._showTrails}
          >Trails</button>
          ${this.editorMode
            ? html`
                <span class="tool-separator" aria-hidden="true"></span>
                ${this._toolButton("pan", "Move")}
                ${this._toolButton("wall", "Draw wall")}
                ${this._toolButton("room", "Draw room")}
                ${this._toolButton("zone", "Draw zone")}
                ${this._draftPoints.length > 0
                  ? html`<button type="button" class="commit" @click=${this._finishDrawing}>
                      Finish ${this._tool}
                    </button>`
                  : nothing}
              `
            : nothing}
        </div>
      </header>
    `;
  }

  private _toolButton(tool: DrawingTool, label: string): TemplateResult {
    return html`<button
      type="button"
      class=${this._tool === tool ? "active" : ""}
      aria-pressed=${this._tool === tool}
      @click=${() => {
        this._tool = tool;
        this._draftPoints = [];
      }}
    >${label}</button>`;
  }

  private _renderMap(floor: Floor, runtimes: RadarRuntime[]): TemplateResult {
    const view = this._view;
    return html`
      <div class="map-frame">
        <svg
          class="map"
          role="img"
          aria-label="${floor.name} live presence map"
          viewBox="${view.x} ${view.y} ${view.width} ${view.height}"
          preserveAspectRatio="xMidYMid meet"
          @wheel=${this._wheel}
          @pointerdown=${this._pointerDown}
          @pointermove=${this._pointerMove}
          @pointerup=${this._pointerUp}
          @pointercancel=${this._pointerUp}
          @click=${this._mapClick}
        >
          <rect class="paper" width=${floor.width} height=${floor.height}></rect>
          ${floor.background
            ? svg`<image
                class="background"
                href=${floor.background}
                width=${floor.width}
                height=${floor.height}
                preserveAspectRatio="xMidYMid meet"
              ></image>`
            : nothing}
          <g class="rooms">${(floor.rooms ?? []).map((room) => this._renderRoom(room))}</g>
          <g class="zones">${(floor.zones ?? []).map((zone) => this._renderZone(zone))}</g>
          <g class="walls">${(floor.walls ?? []).map((wall) => this._renderWall(wall))}</g>
          ${this._showCoverage
            ? svg`<g class="coverage">${runtimes.map((runtime) => this._renderCoverage(runtime, floor))}</g>`
            : nothing}
          ${this._showTrails ? this._renderTrails() : nothing}
          <g class="targets">
            ${runtimes.flatMap((runtime) =>
              runtime.targets.map((target) => this._renderTarget(target)),
            )}
          </g>
          <g class="sensors">
            ${runtimes.map((runtime) => this._renderSensor(runtime))}
          </g>
          ${this._draftPoints.length
            ? svg`<polyline class="draft" points=${pointsAttribute(this._draftPoints)}></polyline>
                ${this._draftPoints.map(
                  (point) => svg`<circle class="draft-point" cx=${point.x} cy=${point.y} r="6"></circle>`,
                )}`
            : nothing}
        </svg>
        ${runtimes.length === 0
          ? html`<div class="map-empty">
              <strong>No compatible radar found</strong>
              <span>Add an LD2450 sensor or configure an entity prefix.</span>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderRoom(room: PathFeature): TemplateResult {
    return svg`
      <polygon points=${pointsAttribute(room.points)}></polygon>
      ${room.name && room.points[0]
        ? svg`<text x=${room.points[0].x + 12} y=${room.points[0].y + 24}>${room.name}</text>`
        : nothing}
    `;
  }

  private _renderZone(zone: PathFeature): TemplateResult {
    return svg`<polygon points=${pointsAttribute(zone.points)}></polygon>`;
  }

  private _renderWall(wall: PathFeature): TemplateResult {
    return svg`<polyline points=${pointsAttribute(wall.points)}></polyline>`;
  }

  private _renderCoverage(runtime: RadarRuntime, floor: Floor): TemplateResult {
    const sensor = runtime.sensor;
    return svg`
      <path class="coverage-fringe" d=${coverageSectorPath(sensor, floor.pixels_per_meter, 1)}></path>
      <path class="coverage-usable" d=${coverageSectorPath(sensor, floor.pixels_per_meter, 0.72)}></path>
      <path class="coverage-strong" d=${coverageSectorPath(sensor, floor.pixels_per_meter, 0.4)}></path>
    `;
  }

  private _renderTrails(): TemplateResult {
    const cutoff = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1000;
    const lines = [...this._trails.entries()].map(([id, targets]) => {
      const active = targets.filter((target) => target.updatedAt >= cutoff);
      return active.length > 1
        ? svg`<polyline class="trail" data-track=${id} points=${pointsAttribute(
            active.map((target) => target.floorPoint),
          )}></polyline>`
        : nothing;
    });
    return svg`<g class="trails">${lines}</g>`;
  }

  private _renderTarget(target: RadarTarget): TemplateResult {
    return svg`
      <g class="target" transform="translate(${target.floorPoint.x} ${target.floorPoint.y})">
        <circle r="12"></circle>
        <circle class="target-core" r="4"></circle>
        <text x="17" y="5">${target.index}</text>
      </g>
    `;
  }

  private _renderSensor(runtime: RadarRuntime): TemplateResult {
    const sensor = runtime.sensor;
    const selected = sensor.id === this._selectedSensorId;
    return svg`
      <g
        class="sensor ${selected ? "selected" : ""} ${runtime.online ? "" : "offline"}"
        data-sensor=${sensor.id}
        transform="translate(${sensor.x} ${sensor.y}) rotate(${sensor.heading})"
        tabindex="0"
        role="button"
        aria-label="${sensor.name ?? sensor.id} radar"
      >
        <circle r="20"></circle>
        <path d="M 0 -28 L -8 -12 L 8 -12 Z"></path>
        <circle class="sensor-core" r="7"></circle>
      </g>
    `;
  }

  private _renderInspector(runtime: RadarRuntime, floor: Floor): TemplateResult {
    const sensor = runtime.sensor;
    return html`
      <aside class="inspector" aria-label="Selected radar details">
        <div class="inspector-heading">
          <div>
            <strong>${sensor.name ?? sensor.id}</strong>
            <span>${runtime.online ? "Online" : "Unavailable"}</span>
          </div>
          <button type="button" class="icon-button" @click=${() => (this._selectedSensorId = undefined)} aria-label="Close inspector">×</button>
        </div>
        ${runtime.discovered
          ? html`<p class="notice">Discovered automatically. Move it in the editor to save its placement.</p>`
          : nothing}
        <dl>
          <div><dt>Targets</dt><dd>${runtime.targets.length}</dd></div>
          <div><dt>Position</dt><dd>${Math.round(sensor.x)}, ${Math.round(sensor.y)}</dd></div>
          <div><dt>Heading</dt><dd>${Math.round(normalizeHeading(sensor.heading))}°</dd></div>
          <div><dt>Range</dt><dd>${sensor.range_m ?? 6} m</dd></div>
          ${runtime.temperature === undefined
            ? nothing
            : html`<div><dt>Temperature</dt><dd>${runtime.temperature.toFixed(1)}°</dd></div>`}
          ${runtime.humidity === undefined
            ? nothing
            : html`<div><dt>Humidity</dt><dd>${runtime.humidity.toFixed(1)}%</dd></div>`}
        </dl>
        ${this.editorMode
          ? html`
              <div class="rotation">
                <span>Rotate</span>
                <button type="button" @click=${() => this._rotateSensor(sensor, -15)}>−15°</button>
                <button type="button" @click=${() => this._rotateSensor(sensor, -1)}>−1°</button>
                <button type="button" @click=${() => this._rotateSensor(sensor, 1)}>+1°</button>
                <button type="button" @click=${() => this._rotateSensor(sensor, 15)}>+15°</button>
              </div>
              <label class="range-control">
                <span>Range ${sensor.range_m ?? 6} m</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.25"
                  .value=${String(sensor.range_m ?? 6)}
                  @input=${(event: Event) =>
                    this._updateSensor(sensor, {
                      range_m: Number((event.target as HTMLInputElement).value),
                    })}
                />
              </label>
              <small>${floor.pixels_per_meter} canvas px per metre</small>
            `
          : nothing}
      </aside>
    `;
  }

  private _renderEditorHint(): TemplateResult {
    const text =
      this._tool === "pan"
        ? "Drag the map to pan. Drag a radar to place it."
        : `Click to add ${this._tool} points, then choose Finish ${this._tool}.`;
    return html`<footer class="editor-hint">${text}</footer>`;
  }

  private _changeFloor(event: Event): void {
    this._floorId = (event.target as HTMLSelectElement).value;
    this.dispatchEvent(
      new CustomEvent("spatial-floor-changed", {
        detail: { floorId: this._floorId },
        bubbles: true,
        composed: true,
      }),
    );
    this._selectedSensorId = undefined;
    this._draftPoints = [];
    this._fit();
  }

  private _fit = (): void => {
    const floor = this._floor;
    if (!floor) return;
    this._view = { x: 0, y: 0, width: floor.width, height: floor.height };
  };

  private _wheel(event: WheelEvent): void {
    const floor = this._floor;
    const svgElement = event.currentTarget as SVGSVGElement;
    if (!floor) return;
    event.preventDefault();
    const anchor = clientToFloorPoint(
      event.clientX,
      event.clientY,
      svgElement.getBoundingClientRect(),
      this._view,
    );
    this._view = zoomViewBox(
      this._view,
      anchor,
      event.deltaY > 0 ? 1.12 : 0.88,
      floor,
    );
  }

  private _pointerDown(event: PointerEvent): void {
    const target = event.target as Element;
    const sensorElement = target.closest<SVGGElement>("[data-sensor]");
    const svgElement = event.currentTarget as SVGSVGElement;
    svgElement.setPointerCapture(event.pointerId);
    this._pointerMoved = false;

    if (sensorElement) {
      const sensorId = sensorElement.dataset.sensor;
      if (!sensorId) return;
      this._selectedSensorId = sensorId;
      if (this.editorMode && this._tool === "pan") {
        this._drag = { kind: "sensor", sensorId };
      }
      return;
    }

    if (this._tool === "pan") {
      this._drag = {
        kind: "pan",
        clientX: event.clientX,
        clientY: event.clientY,
        view: { ...this._view },
      };
    }
  }

  private _pointerMove(event: PointerEvent): void {
    if (!this._drag) return;
    const svgElement = event.currentTarget as SVGSVGElement;
    this._pointerMoved = true;

    if (this._drag.kind === "sensor") {
      const sensorId = this._drag.sensorId;
      const point = clientToFloorPoint(
        event.clientX,
        event.clientY,
        svgElement.getBoundingClientRect(),
        this._view,
      );
      const sensor = this._runtimes.find(
        (entry) => entry.sensor.id === sensorId,
      )?.sensor;
      if (sensor) this._updateSensor(sensor, point, false);
      return;
    }

    const rect = svgElement.getBoundingClientRect();
    const scaleX = this._drag.view.width / rect.width;
    const scaleY = this._drag.view.height / rect.height;
    this._view = {
      ...this._drag.view,
      x: this._drag.view.x - (event.clientX - this._drag.clientX) * scaleX,
      y: this._drag.view.y - (event.clientY - this._drag.clientY) * scaleY,
    };
  }

  private _pointerUp(event: PointerEvent): void {
    const svgElement = event.currentTarget as SVGSVGElement;
    if (svgElement.hasPointerCapture(event.pointerId)) {
      svgElement.releasePointerCapture(event.pointerId);
    }
    if (this._drag?.kind === "sensor") this._emitConfig();
    this._drag = undefined;
  }

  private _mapClick(event: MouseEvent): void {
    if (!this.editorMode || this._tool === "pan" || this._pointerMoved) return;
    const svgElement = event.currentTarget as SVGSVGElement;
    const point = clientToFloorPoint(
      event.clientX,
      event.clientY,
      svgElement.getBoundingClientRect(),
      this._view,
    );
    this._draftPoints = [...this._draftPoints, point];
  }

  private _finishDrawing(): void {
    const floor = this._floor;
    if (!floor || !this._config) return;
    const minimum = this._tool === "wall" ? 2 : 3;
    if (this._draftPoints.length < minimum) return;

    const feature: PathFeature = {
      id: `${this._tool}-${crypto.randomUUID()}`,
      ...(this._tool === "room"
          ? { name: `Room ${(floor.rooms?.length ?? 0) + 1}` }
          : this._tool === "zone"
          ? {
              name: `Zone ${(floor.zones?.length ?? 0) + 1}`,
              kind: "detection" as const,
            }
          : {}),
      points: [...this._draftPoints],
    };
    const key =
      this._tool === "room" ? "rooms" : this._tool === "zone" ? "zones" : "walls";
    this._replaceFloor({ ...floor, [key]: [...(floor[key] ?? []), feature] });
    this._draftPoints = [];
    this._emitConfig();
  }

  private _rotateSensor(sensor: RadarSensor, delta: number): void {
    this._updateSensor(sensor, { heading: normalizeHeading(sensor.heading + delta) });
  }

  private _updateSensor(
    sensor: RadarSensor,
    patch: Partial<RadarSensor> | Point,
    emit = true,
  ): void {
    const floor = this._floor;
    if (!floor) return;
    const sensors = [...(floor.sensors ?? [])];
    const index = sensors.findIndex((entry) => entry.id === sensor.id);
    const updated = { ...sensor, ...patch };
    if (index >= 0) sensors[index] = updated;
    else sensors.push(updated);
    this._replaceFloor({ ...floor, sensors });
    if (emit) this._emitConfig();
  }

  private _replaceFloor(updatedFloor: Floor): void {
    if (!this._config) return;
    this._config = {
      ...this._config,
      floors: this._config.floors.map((floor) =>
        floor.id === updatedFloor.id ? updatedFloor : floor,
      ),
    };
  }

  private _emitConfig(): void {
    if (!this._config) return;
    this.dispatchEvent(
      new CustomEvent<SpatialPresenceConfig>("spatial-config-changed", {
        detail: structuredClone(this._config),
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _captureTrails(): void {
    const cutoff = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1000;
    for (const runtime of this._runtimes) {
      for (const target of runtime.targets) {
        const history = this._trails.get(target.id) ?? [];
        history.push(target);
        this._trails.set(
          target.id,
          history.filter((entry) => entry.updatedAt >= cutoff).slice(-80),
        );
      }
    }
  }

  private get _floor(): Floor | undefined {
    return this._config?.floors.find((floor) => floor.id === this._floorId);
  }

  private get _runtimes(): RadarRuntime[] {
    const floor = this._floor;
    if (!floor) return [];
    return runtimeForFloor(
      this.hass,
      floor,
      this._config?.auto_discover !== false,
    );
  }

  static styles = css`
    :host {
      display: block;
      --sp-ink: #14232b;
      --sp-paper: #f6f8f7;
      --sp-radar: #00a7a5;
      --sp-heading: #f2a93b;
      --sp-target: #c026d3;
      --sp-muted: #647681;
      color: var(--primary-text-color, var(--sp-ink));
    }

    ha-card {
      height: min(78dvh, 920px);
      min-height: 430px;
      overflow: hidden;
      background: var(--ha-card-background, #fff);
    }

    .shell {
      height: 100%;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--sp-ink) 16%, transparent);
      background: color-mix(in srgb, var(--sp-paper) 92%, transparent);
      position: relative;
      z-index: 3;
    }

    select,
    button,
    input {
      font: inherit;
    }

    select,
    button {
      min-height: 36px;
      border: 1px solid color-mix(in srgb, var(--sp-ink) 20%, transparent);
      border-radius: 8px;
      background: var(--sp-paper);
      color: var(--sp-ink);
    }

    select {
      padding: 0 34px 0 11px;
      font-weight: 650;
    }

    button {
      padding: 0 11px;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible,
    select:focus-visible,
    input:focus-visible {
      border-color: var(--sp-radar);
      outline: 2px solid color-mix(in srgb, var(--sp-radar) 30%, transparent);
      outline-offset: 1px;
    }

    button.active {
      color: #fff;
      border-color: var(--sp-ink);
      background: var(--sp-ink);
    }

    button.commit {
      color: var(--sp-ink);
      border-color: var(--sp-heading);
      background: color-mix(in srgb, var(--sp-heading) 24%, white);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .tool-separator {
      width: 1px;
      height: 26px;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--sp-ink) 20%, transparent);
    }

    .workspace,
    .map-frame {
      min-width: 0;
      min-height: 0;
      position: relative;
    }

    .map-frame {
      width: 100%;
      height: 100%;
      overflow: hidden;
      touch-action: none;
      background: #dfe7e7;
    }

    .map {
      width: 100%;
      height: 100%;
      display: block;
      user-select: none;
    }

    .paper {
      fill: var(--sp-paper);
    }

    .background {
      opacity: 0.72;
      pointer-events: none;
    }

    .rooms polygon {
      fill: color-mix(in srgb, var(--sp-radar) 7%, transparent);
      stroke: color-mix(in srgb, var(--sp-radar) 42%, transparent);
      stroke-width: 1.5;
    }

    .rooms text {
      fill: var(--sp-muted);
      font-size: 18px;
      font-weight: 650;
      paint-order: stroke;
      stroke: var(--sp-paper);
      stroke-width: 4px;
    }

    .zones polygon {
      fill: color-mix(in srgb, var(--sp-heading) 12%, transparent);
      stroke: var(--sp-heading);
      stroke-dasharray: 8 6;
      stroke-width: 2;
    }

    .walls polyline {
      fill: none;
      stroke: var(--sp-ink);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .coverage path {
      stroke: none;
      pointer-events: none;
    }

    .coverage-fringe { fill: color-mix(in srgb, var(--sp-radar) 8%, transparent); }
    .coverage-usable { fill: color-mix(in srgb, var(--sp-radar) 11%, transparent); }
    .coverage-strong { fill: color-mix(in srgb, var(--sp-radar) 16%, transparent); }

    .trail {
      fill: none;
      stroke: color-mix(in srgb, var(--sp-target) 40%, transparent);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .target circle:first-child {
      fill: color-mix(in srgb, var(--sp-target) 16%, transparent);
      stroke: var(--sp-target);
      stroke-width: 3;
    }

    .target-core { fill: var(--sp-target); }

    .target text {
      fill: var(--sp-target);
      font-size: 17px;
      font-weight: 750;
    }

    .sensor {
      cursor: pointer;
      outline: none;
    }

    .sensor > circle:first-child {
      fill: var(--sp-ink);
      stroke: var(--sp-paper);
      stroke-width: 3;
    }

    .sensor path { fill: var(--sp-heading); }
    .sensor-core { fill: var(--sp-radar); }
    .sensor.selected > circle:first-child { stroke: var(--sp-heading); stroke-width: 6; }
    .sensor.offline { opacity: 0.45; }

    .draft {
      fill: none;
      stroke: var(--sp-heading);
      stroke-width: 5;
      stroke-linecap: round;
      stroke-dasharray: 12 8;
    }

    .draft-point {
      fill: var(--sp-heading);
      stroke: var(--sp-paper);
      stroke-width: 2;
    }

    .inspector {
      position: absolute;
      z-index: 2;
      top: 14px;
      right: 14px;
      width: min(290px, calc(100% - 28px));
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--sp-ink) 16%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, white 94%, transparent);
      box-shadow: 0 12px 38px rgba(20, 35, 43, 0.18);
      backdrop-filter: blur(12px);
    }

    .inspector-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
    }

    .inspector-heading div {
      display: grid;
      gap: 3px;
    }

    .inspector-heading strong { font-size: 17px; }
    .inspector-heading span, .inspector small { color: var(--sp-muted); }

    .icon-button {
      min-width: 32px;
      min-height: 32px;
      padding: 0;
      font-size: 22px;
      line-height: 1;
    }

    .notice {
      margin: 12px 0;
      padding: 9px 10px;
      border-left: 3px solid var(--sp-heading);
      background: color-mix(in srgb, var(--sp-heading) 12%, white);
      font-size: 13px;
      line-height: 1.35;
    }

    dl {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      margin: 16px 0;
    }

    dl div { min-width: 0; }
    dt { color: var(--sp-muted); font-size: 12px; }
    dd { margin: 2px 0 0; font-weight: 700; }

    .rotation {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      margin-top: 12px;
    }

    .rotation span {
      grid-column: 1 / -1;
      color: var(--sp-muted);
      font-size: 12px;
    }

    .rotation button { min-width: 0; padding: 0 4px; }

    .range-control {
      display: grid;
      gap: 4px;
      margin: 14px 0;
      color: var(--sp-muted);
      font-size: 12px;
    }

    .range-control input { width: 100%; accent-color: var(--sp-radar); }

    .map-empty {
      position: absolute;
      inset: 50% auto auto 50%;
      transform: translate(-50%, -50%);
      display: grid;
      gap: 5px;
      width: min(360px, calc(100% - 40px));
      text-align: center;
      color: var(--sp-muted);
      pointer-events: none;
    }

    .map-empty strong { color: var(--sp-ink); }

    .editor-hint {
      padding: 8px 12px;
      border-top: 1px solid color-mix(in srgb, var(--sp-ink) 14%, transparent);
      background: var(--sp-paper);
      color: var(--sp-muted);
      font-size: 13px;
    }

    .empty { padding: 24px; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 720px) {
      ha-card { height: min(76dvh, 760px); min-height: 460px; }
      .toolbar { align-items: stretch; flex-direction: column; gap: 7px; }
      .floor-select select { width: 100%; }
      .toolbar-actions { padding-bottom: 2px; }
      .inspector {
        top: auto;
        right: 8px;
        bottom: 8px;
        left: 8px;
        width: auto;
        max-height: 45%;
        overflow: auto;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
    }
  `;
}

export class SpatialPresenceCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass: HomeAssistant = EMPTY_HASS;
  private _config: SpatialPresenceConfig = {
    type: "custom:spatial-presence-card",
    ...SpatialPresenceCard.getStubConfig(),
  };
  private _radarPrefix = "";
  private _mapId = "house";
  private _storageStatus = "";

  setConfig(config: SpatialPresenceConfig): void {
    this._config = normalizeConfig(config);
    this._mapId = config.backend_map_id ?? "house";
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor-fields">
        <label>
          <span>Card title</span>
          <input .value=${this._config.title ?? ""} @input=${this._titleChanged} />
        </label>
        <label>
          <span>Floor name</span>
          <input .value=${this._activeFloor?.name ?? ""} @change=${this._floorNameChanged} />
        </label>
        <label>
          <span>Background image URL</span>
          <input
            placeholder="/local/floorplans/main.svg"
            .value=${this._activeFloor?.background ?? ""}
            @change=${this._backgroundChanged}
          />
        </label>
        <label>
          <span>Scale (canvas pixels per metre)</span>
          <input
            type="number"
            min="1"
            step="1"
            .value=${String(this._activeFloor?.pixels_per_meter ?? 100)}
            @change=${this._scaleChanged}
          />
        </label>
        <label>
          <span>Radar entity prefix</span>
          <input
            placeholder="ld2450_presence"
            .value=${this._radarPrefix}
            @input=${(event: Event) =>
              (this._radarPrefix = (event.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          <span>Saved map id</span>
          <input
            pattern="[a-z0-9][a-z0-9_-]{0,63}"
            .value=${this._mapId}
            @input=${(event: Event) =>
              (this._mapId = (event.target as HTMLInputElement).value)}
          />
        </label>
        <div class="editor-actions">
          <button type="button" @click=${this._addRadar}>Add radar</button>
          <button type="button" @click=${this._addFloor}>Add floor</button>
          ${this._config.floors.length > 1
            ? html`<button type="button" class="danger" @click=${this._removeFloor}>Remove floor</button>`
            : nothing}
          <button type="button" @click=${this._exportMap}>Export JSON</button>
          <button type="button" @click=${this._exportEasyFloorplan}>Export for Easy Floorplan</button>
          <button type="button" @click=${this._saveBackend}>Save map</button>
          <button type="button" @click=${this._loadBackend}>Load saved</button>
          <button type="button" @click=${this._restoreBackend}>Restore previous</button>
          <label class="file-button">
            Import JSON
            <input type="file" accept="application/json,.json" @change=${this._importMap} />
          </label>
        </div>
        ${this._storageStatus
          ? html`<p class="storage-status" role="status">${this._storageStatus}</p>`
          : nothing}
      </div>
      <spatial-presence-card
        .hass=${this.hass}
        .editorMode=${true}
        ._config=${this._config}
        @spatial-config-changed=${this._mapChanged}
        @spatial-floor-changed=${this._floorChanged}
      ></spatial-presence-card>
    `;
  }

  protected updated(): void {
    const card = this.renderRoot.querySelector<SpatialPresenceCard>(
      "spatial-presence-card",
    );
    card?.setConfig(this._config);
  }

  private _titleChanged(event: Event): void {
    this._commit({
      ...this._config,
      title: (event.target as HTMLInputElement).value,
    });
  }

  private _backgroundChanged(event: Event): void {
    const floor = this._activeFloor;
    if (!floor) return;
    const background = (event.target as HTMLInputElement).value.trim();
    const updated = { ...floor };
    if (background && safeImageUrl(background)) updated.background = background;
    else delete updated.background;
    this._replaceFloor(updated);
  }

  private _floorNameChanged(event: Event): void {
    const floor = this._activeFloor;
    const name = (event.target as HTMLInputElement).value.trim();
    if (floor && name) this._replaceFloor({ ...floor, name });
  }

  private _scaleChanged(event: Event): void {
    const floor = this._activeFloor;
    if (!floor) return;
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value) && value > 0) {
      this._replaceFloor({ ...floor, pixels_per_meter: value });
    }
  }

  private _addFloor(): void {
    const number = this._config.floors.length + 1;
    const floor = defaultFloor(`floor-${number}`, `Floor ${number}`);
    this._commit({
      ...this._config,
      floors: [...this._config.floors, floor],
      default_floor: floor.id,
    });
  }

  private _removeFloor(): void {
    const active = this._activeFloor;
    if (!active || this._config.floors.length <= 1) return;
    const floors = this._config.floors.filter((floor) => floor.id !== active.id);
    this._commit({ ...this._config, floors, default_floor: floors[0]!.id });
  }

  private _addRadar(): void {
    const floor = this._activeFloor;
    const prefix = this._radarPrefix.trim();
    if (!floor || !prefix) return;
    const id = uniqueId(prefix.replace(/[^a-z0-9_]+/gi, "_"), floor.sensors ?? []);
    const sensor: RadarSensor = {
      id,
      name: prefix
        .split("_")
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join(" "),
      entity_prefix: prefix,
      x: floor.width / 2,
      y: floor.height * 0.85,
      heading: 0,
      range_m: 6,
      fov_degrees: 120,
      mount: "wall",
    };
    this._replaceFloor({ ...floor, sensors: [...(floor.sensors ?? []), sensor] });
    this._radarPrefix = "";
    this.requestUpdate();
  }

  private _floorChanged(event: CustomEvent<{ floorId: string }>): void {
    event.stopPropagation();
    this._commit({ ...this._config, default_floor: event.detail.floorId });
  }

  private _exportMap(): void {
    downloadJson(toPortableMap(this._config), "spatial-presence-map.json");
  }

  private _exportEasyFloorplan(): void {
    downloadJson(
      exportEasyFloorplan(this._config),
      "spatial-presence-easy-floorplan.json",
    );
  }

  private async _importMap(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || file.size > 2_000_000) return;
    try {
      const candidate = JSON.parse(await file.text()) as Record<string, unknown>;
      let converted: SpatialPresenceConfig;
      let warnings: string[] = [];
      if (candidate.schema_version === "0.1" && Array.isArray(candidate.floors)) {
        converted = normalizeConfig({
          ...(candidate as unknown as SpatialPresenceConfig),
          type: "custom:spatial-presence-card",
        });
      } else if (
        String(candidate.type ?? "").includes("easy-floorplan") ||
        Array.isArray(candidate.areas) ||
        Array.isArray(candidate.walls)
      ) {
        const result = importEasyFloorplan(candidate);
        converted = normalizeConfig({
          ...result.map,
          type: "custom:spatial-presence-card",
        });
        warnings = result.warnings;
      } else if (isRecord(candidate.maps) || isRecord(candidate.radars)) {
        const result = importRadarMapManager(candidate);
        converted = normalizeConfig({
          ...result.map,
          type: "custom:spatial-presence-card",
        });
        warnings = result.warnings;
      } else {
        throw new Error("Use a Spatial Presence, Easy Floorplan or Radar Map Manager JSON file");
      }
      this._commit(converted);
      this._storageStatus = warnings.length
        ? `Imported with ${warnings.length} review note${warnings.length === 1 ? "" : "s"}: ${warnings.join(" ")}`
        : "Map imported.";
    } catch (error) {
      this._storageStatus = `Map was not imported: ${errorMessage(error)}`;
    } finally {
      input.value = "";
    }
  }

  private async _saveBackend(): Promise<void> {
    if (!this._validMapId) {
      this._storageStatus = "Use lowercase letters, numbers, underscores or hyphens for the map id.";
      return;
    }
    this._storageStatus = "Saving map…";
    try {
      const result = await saveStoredMap(this.hass, this._mapId, this._config);
      this._commit({ ...this._config, backend_map_id: this._mapId });
      this._storageStatus = `Saved revision ${result.revision}.`;
    } catch (error) {
      this._storageStatus = `Map was not saved: ${errorMessage(error)}`;
    }
  }

  private async _loadBackend(): Promise<void> {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Loading map…";
    try {
      const result = await loadStoredMap(this.hass, this._mapId);
      this._commit(
        normalizeConfig({
          ...result.config,
          type: "custom:spatial-presence-card",
          backend_map_id: this._mapId,
        }),
      );
      this._storageStatus = `Loaded revision ${result.revision}.`;
    } catch (error) {
      this._storageStatus = `Map was not loaded: ${errorMessage(error)}`;
    }
  }

  private async _restoreBackend(): Promise<void> {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Restoring previous revision…";
    try {
      await restoreStoredMap(this.hass, this._mapId);
      await this._loadBackend();
    } catch (error) {
      this._storageStatus = `Previous revision was not restored: ${errorMessage(error)}`;
    }
  }

  private _replaceFloor(floor: Floor): void {
    this._commit({
      ...this._config,
      floors: this._config.floors.map((entry) =>
        entry.id === floor.id ? floor : entry,
      ),
    });
  }

  private _mapChanged(event: CustomEvent<SpatialPresenceConfig>): void {
    event.stopPropagation();
    this._commit(event.detail);
  }

  private _commit(config: SpatialPresenceConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get _activeFloor(): Floor | undefined {
    return (
      this._config.floors.find(
        (floor) => floor.id === this._config.default_floor,
      ) ?? this._config.floors[0]
    );
  }

  private get _validMapId(): boolean {
    return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(this._mapId);
  }

  static styles = css`
    :host { display: grid; gap: 16px; }
    .editor-fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: end;
    }
    label { display: grid; gap: 6px; min-width: 0; }
    label span { color: var(--secondary-text-color); font-size: 13px; }
    input, button {
      min-height: 40px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 0 11px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    button { cursor: pointer; }
    .editor-actions {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .storage-status {
      grid-column: 1 / -1;
      margin: 0;
      padding: 9px 11px;
      border-left: 3px solid #00a7a5;
      background: color-mix(in srgb, #00a7a5 9%, transparent);
      font-size: 13px;
    }
    .danger { color: var(--error-color, #b3261e); }
    .file-button {
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 0 11px;
      cursor: pointer;
    }
    .file-button input { display: none; }
    @media (max-width: 760px) {
      .editor-fields { grid-template-columns: 1fr; }
    }
  `;
}

function normalizeConfig(config: SpatialPresenceConfig): SpatialPresenceConfig {
  return {
    ...config,
    type: config.type || "custom:spatial-presence-card",
    schema_version: "0.1",
    auto_discover: config.auto_discover !== false,
    target_trail_seconds: config.target_trail_seconds ?? 8,
    floors: config.floors.map((floor) => {
      const normalized = {
        ...floor,
        pixels_per_meter: floor.pixels_per_meter || 100,
        walls: floor.walls ?? [],
        rooms: floor.rooms ?? [],
        zones: floor.zones ?? [],
        sensors: floor.sensors ?? [],
      };
      if (normalized.background && !safeImageUrl(normalized.background)) {
        delete normalized.background;
      }
      return normalized;
    }),
  };
}

function defaultFloor(id = "main", name = "Main floor"): Floor {
  return {
    id,
    name,
    width: 1200,
    height: 800,
    pixels_per_meter: 100,
    walls: [],
    rooms: [],
    zones: [],
    sensors: [],
  };
}

function uniqueId(base: string, sensors: RadarSensor[]): string {
  const safeBase = base || "radar";
  if (!sensors.some((sensor) => sensor.id === safeBase)) return safeBase;
  let index = 2;
  while (sensors.some((sensor) => sensor.id === `${safeBase}_${index}`)) index += 1;
  return `${safeBase}_${index}`;
}

function safeImageUrl(value: string): boolean {
  return /^(\/|https?:\/\/)/i.test(value.trim());
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function downloadJson(value: unknown, filename: string): void {
  const payload = JSON.stringify(value, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

if (!customElements.get("spatial-presence-card")) {
  customElements.define("spatial-presence-card", SpatialPresenceCard);
}
if (!customElements.get("spatial-presence-card-editor")) {
  customElements.define("spatial-presence-card-editor", SpatialPresenceCardEditor);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "spatial-presence-card",
  name: "Spatial Presence",
  description: "Draw floors and place live mmWave radar targets.",
  preview: true,
  documentationURL: "https://github.com/daredoole/spatial-presence",
});

console.info(
  `%c SPATIAL PRESENCE %c ${CARD_VERSION} `,
  "color:white;background:#14232b;font-weight:700;padding:3px 5px",
  "color:#14232b;background:#f2a93b;font-weight:700;padding:3px 5px",
);
