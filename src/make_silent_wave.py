import wave

SAMPLING_RATE = 44100


with wave.open("silent.wav", "wb") as f:
    f.setnchannels(1)
    f.setsampwidth(1)
    f.setframerate(SAMPLING_RATE)
    f.writeframes(b"\x81" * (SAMPLING_RATE * 2))

