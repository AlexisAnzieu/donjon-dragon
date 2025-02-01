import React, { createContext, useContext, useState, useEffect } from "react";

interface MidiBinding {
  signal: string;
  index: number;
}

interface MidiContextType {
  bindings: MidiBinding[];
  setBindings: (bindings: MidiBinding[]) => void;
  currentSignal: string | null;
  isAssigning: boolean;
  setIsAssigning: (value: boolean) => void;
  saveBindings: (bindings: MidiBinding[]) => void;
}

const MidiContext = createContext<MidiContextType | null>(null);

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const [bindings, setBindings] = useState<MidiBinding[]>([]);
  const [currentSignal, setCurrentSignal] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const loadMidiBindings = async () => {
      try {
        const response = await fetch("/api/settings/midi-attribution");
        const data = await response.json();
        if (data.value) {
          setBindings(data.value);
        }
      } catch (error) {
        console.error("Failed to load MIDI bindings:", error);
      }
    };

    loadMidiBindings();
  }, []);

  const saveBindings = async (newBindings: MidiBinding[]) => {
    try {
      await fetch("/api/settings/midi-attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newBindings }),
      });
    } catch (error) {
      console.error("Failed to save MIDI bindings:", error);
    }
  };

  useEffect(() => {
    const handleMidiMessage = (event: WebMidi.MIDIMessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [status, note] = event.data;
      const signal = `${status}-${note}`;
      if (!isAssigning) {
        setCurrentSignal(signal);
      }
    };

    const setupMidi = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = midiAccess.inputs.values();

        for (const input of inputs) {
          input.onmidimessage = handleMidiMessage;
        }
      } catch (err) {
        console.error("MIDI access denied:", err);
      }
    };

    setupMidi();
  }, [isAssigning]);

  return (
    <MidiContext.Provider
      value={{
        bindings,
        setBindings,
        currentSignal,
        isAssigning,
        setIsAssigning,
        saveBindings,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}

export const useMidi = () => {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error("useMidi must be used within a MidiProvider");
  }
  return context;
};
