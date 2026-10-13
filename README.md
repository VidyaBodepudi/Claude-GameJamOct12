# Realm Racer

A top-down arcade racer built with vanilla JavaScript and HTML canvas. No build step or dependencies.

## Play

Open `index.html` in a browser.

| Key | Action |
| --- | --- |
| Arrows / WASD | Drive |
| Space | Nitro |
| Enter | Continue |
| R | Restart realm |

## Sound effects

The WAV files in `sounds/` come from a script that generates them:

```sh
python3 tools/make_sounds.py
```

The background music is generated live in the browser with the Web Audio API, so there is no music file. Press M to mute.
