# Security policy

Do not report vulnerabilities in public issues. Use GitHub private vulnerability
reporting when the repository is published.

The project accepts floorplan URLs and renders them through an SVG `<image>`
element. It never inserts imported SVG markup into the document. Target trails
are ephemeral and local to the browser by default. Reports involving script
execution, path traversal, unauthorized Home Assistant state changes or target
history disclosure are high priority.

