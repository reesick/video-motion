# Voice-over for Fish Audio Drama 3

How Drama 3 reads directions (https://docs.fish.audio/features/text-to-speech/drama-3):
* `[direction]` in square brackets, written like a brief to a voice actor, applies to the words after it.
* `[pause]`, `[short pause]`, `[breath]`, `[sigh]` go exactly where the sound or silence should be.
* Paired tags change only the wrapped words: `<emphasis>`, `<slow>`, `<fast>`, `<soft>`, `<whisper>`, `<stress>`, `<forceful>`.
* Model: `drama-3`. Suggested public voice: **Delia** (EN-US, female), id `c70cfb98867a4bfb9ae20d2401257b92`.

Paste the six chunks from `alos/docs/fish_chunks.txt` one at a time. Fish Audio allows 500 characters per generation,
and each chunk is 190–387. Use the same voice for all six. Save them as `alos/audio/vo/fish_01.wav` … `fish_06.wav`, then:

    python tools/join_vo.py alos/audio/vo/fish_voiceover.wav 0.45 0.6 alos/audio/vo/fish_01.wav alos/audio/vo/fish_02.wav alos/audio/vo/fish_03.wav alos/audio/vo/fish_04.wav alos/audio/vo/fish_05.wav alos/audio/vo/fish_06.wav
    python tools/transcribe.py alos/audio/vo/fish_voiceover.wav alos/docs/transcript.json small.en

Fallback without Fish Audio: `python tools/tts_lines.py alos/docs/vo_lines.txt alos/audio/vo en-US-AvaNeural "+4%" 0.32 0.6`
(already generated as `alos/audio/vo/voiceover.wav`, 54.2 s).

Full script for reference (single block):

```
[calm, low, cinematic trailer narrator, slow and deliberate] A factory doesn't stop when it runs out of everything. [short pause] It stops when it runs out of <emphasis>one</emphasis> part.

[pause]

[tense, clipped, each fact lands like a countdown] Seven hundred controllers. [short pause] Due in six days. [short pause] <slow>Zero on hand.</slow>

[pause]

[slightly mocking, quoting the supplier, light and too reassuring] Then the supplier writes: "Goods dispatched."

[short pause]

[flat and cold, the truth arriving] The carrier says: label created. [short pause] <stress>No pickup.</stress>

[long pause]

[breath] [warm, confident, a reveal, a small smile in the voice] Meet <emphasis>Disruption Ops</emphasis>. [short pause] [proud, clear] The autonomous supply-chain firefighter.

[pause]

[energetic, building momentum, fast but crisp] It reads every email, and checks every claim against the carrier.

[short pause]

[punchy, quick, like checking boxes] Lie detected. [short pause] Trust drops. [short pause] [satisfied, smooth] The hold is voided, and the parts are re-sourced by air.

[pause]

[sharp, a little amused, rhetorical question] The cheapest quote has no certification? [short pause] [firm, decisive] Refused. [short pause] With the rule that stopped it.

[short pause]

[measured, reassuring, responsible] Over five thousand dollars, it waits for a human.

[short pause]

[calm, trustworthy] And money only moves when the goods are <emphasis>verified</emphasis>.

[pause]

[rising, impressive, each number bigger than the last] One ninety-two claims checked. [short pause] Seventeen lies caught. [short pause] <forceful>Fifteen thousand dollars</forceful> recovered.

[long pause]

[quiet, slow, every word weighted, a closing line] The model explains. [pause] The code <emphasis>decides</emphasis>.

[long pause]

[warm, final, confident sign-off] Disruption Ops.
```

Notes:
* The brand is written "Disruption Ops" so it is read as two words. If it still sounds wrong, pin it with phonemes:
  `<|phoneme_start|>D IH0 S R AH1 P SH AH0 N AA1 P S<|phoneme_end|>`.
* "192" is spelled "One ninety-two" so it is not read as "one hundred and ninety-two".
* Target length is 50–56 s. If the take runs long, remove the `[long pause]` tags first.
