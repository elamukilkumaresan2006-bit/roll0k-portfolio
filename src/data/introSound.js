// Two-layer cinematic sound for the intro's flash sequence.
// "Click" starts the instant the flashes begin, playing straight through once.
// "Swipe" starts 1 second later, and skips its own first second of audio
// (it starts from its internal 1-second mark, not from the very start of
// the file).
//
// Files must live in /public/intro/. Leave either as '' to disable that layer.

export const introClickSound = 'click.mp3'
export const introSwipeSound = 'swipe.mp3'