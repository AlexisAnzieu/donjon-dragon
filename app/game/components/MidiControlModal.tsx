import React, { useState, useEffect } from "react";
import { MidiBinding, useMidi } from "../context/MidiContext";

interface MidiControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SquareData {
  number: number;
  waiting: boolean;
  midiSignal?: string;
  label?: string;
}

export function MidiControlModal({ isOpen, onClose }: MidiControlModalProps) {
  const { bindings, setBindings, setIsAssigning, saveBindings } = useMidi();
  const [squares, setSquares] = useState<SquareData[]>(() => {
    const initialSquares = Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      waiting: false,
      label: i === 9 ? "Mode Toggle" : `${i + 1}`,
      midiSignal: "",
    }));

    // Apply bindings to initial state
    bindings.forEach((binding) => {
      if (binding.type === "mode-toggle") {
        initialSquares[9].midiSignal = binding.signal;
      } else if (binding.index < 9) {
        initialSquares[binding.index].midiSignal = binding.signal;
      }
    });

    return initialSquares;
  });
  const [midiStatus, setMidiStatus] = useState<string>("Initializing MIDI...");
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [hasDevices, setHasDevices] = useState(false);

  useEffect(() => {
    setIsAssigning(isOpen);
    return () => setIsAssigning(false);
  }, [isOpen, setIsAssigning]);

  useEffect(() => {
    if (!isOpen) return;

    let midiAccess: WebMidi.MIDIAccess;

    const setupMidi = async () => {
      try {
        midiAccess = await navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());
        setAvailableDevices(
          inputs
            .map((input) => input.name || "")
            .filter((name): name is string => name !== "")
        );
        setHasDevices(inputs.length > 0);

        if (inputs.length === 0) {
          setMidiStatus("No MIDI devices found. Please connect a MIDI device.");
        } else {
          setMidiStatus(
            "MIDI ready! Click a square and press a button on your MIDI device."
          );
        }

        inputs.forEach((input) => {
          input.onmidimessage = handleMidiMessage;
        });
      } catch (err) {
        setMidiStatus(
          "Failed to access MIDI. Please ensure your browser supports MIDI."
        );
        console.error("MIDI access denied:", err);
      }
    };

    const handleMidiMessage = (event: WebMidi.MIDIMessageEvent) => {
      const [status, note] = event.data;
      const waitingIndex = squares.findIndex((s) => s.waiting);

      if (waitingIndex !== -1) {
        const midiSignal = `${status}-${note}`;
        setSquares((prev) => {
          const updated = [...prev];
          updated[waitingIndex] = {
            ...updated[waitingIndex],
            waiting: false,
            midiSignal,
          };
          return updated;
        });

        const newBindings = squares
          .map((square, index) => {
            const signal =
              index === waitingIndex ? midiSignal : square.midiSignal || "";
            if (!signal) return null;

            return {
              signal,
              index: index === 9 ? -1 : index,
              type: index === 9 ? "mode-toggle" : "action",
            } as MidiBinding;
          })
          .filter((binding): binding is MidiBinding => binding !== null);

        setBindings(newBindings);
        saveBindings(newBindings);
      }
    };

    setupMidi();

    return () => {
      if (midiAccess) {
        const inputs = midiAccess.inputs.values();
        for (const input of inputs) {
          input.onmidimessage = null;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, squares]);

  // Add this new useEffect to update squares when bindings change
  useEffect(() => {
    setSquares((prev) => {
      const newSquares = [...prev];
      bindings.forEach((binding) => {
        if (binding.index < newSquares.length) {
          newSquares[binding.index] = {
            ...newSquares[binding.index],
            midiSignal: binding.signal,
          };
        }
      });
      return newSquares;
    });
  }, [bindings]);

  const handleSquareClick = (index: number) => {
    setSquares((prev) => prev.map((s, i) => ({ ...s, waiting: i === index })));
  };

  const handleReset = () => {
    setSquares((prev) =>
      prev.map((s) => ({ ...s, waiting: false, midiSignal: undefined }))
    );
    setBindings([]);
    saveBindings([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">MIDI Control Setup</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <span className="sr-only">Close</span>✕
          </button>
        </div>

        <div className="mb-6">
          <div
            className={`text-sm mb-2 ${
              hasDevices ? "text-green-400" : "text-red-400"
            }`}
          >
            {midiStatus}
          </div>
          {availableDevices.length > 0 && (
            <div className="text-gray-300 text-sm mb-4">
              Connected devices: {availableDevices.join(", ")}
            </div>
          )}
          <p className="text-gray-400 text-sm">
            Assign MIDI controls to actions by clicking a square and pressing
            the desired button/key on your MIDI device.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {squares.slice(0, 9).map((square, index) => (
            <div
              key={square.number}
              onClick={() => handleSquareClick(index)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  square.waiting
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700"
                }
                ${square.midiSignal ? "border-green-500" : ""}
                hover:border-blue-400
              `}
            >
              <div className="text-white text-center">
                <div className="font-medium mb-1">{square.label}</div>
                {square.midiSignal ? (
                  <div className="text-xs text-green-400">
                    Signal: {square.midiSignal}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    {square.waiting
                      ? "Waiting for input..."
                      : "Click to assign"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div
            onClick={() => handleSquareClick(9)}
            className={`
              p-4 border-2 rounded-lg cursor-pointer
              transition-all duration-200
              ${
                squares[9].waiting
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 bg-gray-700"
              }
              ${squares[9].midiSignal ? "border-green-500" : ""}
              hover:border-blue-400
            `}
          >
            <div className="text-white text-center">
              <div className="font-medium mb-1">{squares[9].label}</div>
              {squares[9].midiSignal ? (
                <div className="text-xs text-green-400">
                  Signal: {squares[9].midiSignal}
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  {squares[9].waiting
                    ? "Waiting for input..."
                    : "Click to assign"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Click Reset to clear all assignments
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
