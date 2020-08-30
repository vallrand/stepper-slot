### Build
```bash
npm install
npm run build
```

### Development
```bash
npm run start
```
open index.html with browser

## Project structure

* Compiled files in ./dist
* Entry in src/index.ts
* All images in assets/* will be bundled into src/assets.json

```
src/network/* - back-end logic
src/ui/* - html overlay UI
src/views/* - game scene
src/GameController.ts - Base game logic
```

## Using Debug Mode

index | Reel 1 | Reel 2 | Reel 3
--- | --- | --- | ---
0 | BAR | BAR | BAR
1 | - | - | -
2 | 2xBAR | 2xBAR | 2xBAR
3 | - | - | -
4 | SEVEN | SEVEN | SEVEN
5 | - | - | -
6 | CHERRY | CHERRY | CHERRY
7 | - | - | -
8 | 3xBAR | 3xBAR | 3xBAR
9 | - | - | -

**Example**:

Specifying stop positions 0, 2, 3 will result in

Reel 1 | Reel 2 | Reel 3
--- | --- | ---
| BAR | 2xBAR | - |
| - | - | SEVEN |
| 2xBAR | SEVEN | - |