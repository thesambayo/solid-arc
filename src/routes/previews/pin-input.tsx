import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, Index } from "solid-js";

import {
  PinInput,
  PinInputControl,
  PinInputHiddenInput,
  PinInputInput,
  PinInputLabel,
  PinInputSeparator,
} from "../../components/ui/pin-input";

export const Route = createFileRoute("/previews/pin-input")({
  component: RouteComponent,
});

function Section(props: { title: string; description?: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        {props.description && (
          <p class="mt-0.5 text-xs text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>
      {props.children}
    </div>
  );
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function RouteComponent() {
  const [otp, setOtp] = createSignal<string[]>([]);
  const [done, setDone] = createSignal<string | null>(null);

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Pin Input</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Segmented input for PIN, OTP, and verification codes. Built on Ark UI
          — real inputs with paste-to-fill and auto-advance.
        </p>
      </div>

      <Section title="Basic" description="Four numeric digits.">
        <PinInput>
          <PinInputLabel>PIN</PinInputLabel>
          <PinInputControl>
            <Index each={range(4)}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section
        title="OTP (6 digits, grouped)"
        description="otp mode enables one-time-code autofill; a separator splits the groups."
      >
        <PinInput otp>
          <PinInputControl>
            <Index each={[0, 1, 2]}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
            <PinInputSeparator />
            <Index each={[3, 4, 5]}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section title="Masked" description="mask hides entered digits like a password.">
        <PinInput mask>
          <PinInputControl>
            <Index each={range(4)}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section
        title="Alphanumeric"
        description='type="alphanumeric" accepts letters and numbers.'
      >
        <PinInput type="alphanumeric">
          <PinInputControl>
            <Index each={range(5)}>
              {(i) => <PinInputInput index={i()} class="uppercase" />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section title="Disabled">
        <PinInput disabled defaultValue={["1", "2", "3", "4"]}>
          <PinInputControl>
            <Index each={range(4)}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section title="Invalid" description="invalid applies the destructive treatment.">
        <PinInput invalid defaultValue={["8", "8"]}>
          <PinInputControl>
            <Index each={range(4)}>
              {(i) => <PinInputInput index={i()} />}
            </Index>
          </PinInputControl>
          <PinInputHiddenInput />
        </PinInput>
      </Section>

      <Section
        title="Controlled"
        description="Value in a signal; onValueComplete fires when all slots are filled."
      >
        <div class="flex flex-col gap-3">
          <PinInput
            otp
            value={otp()}
            onValueChange={(e) => setOtp(e.value)}
            onValueComplete={(e) => setDone(e.valueAsString)}
          >
            <PinInputControl>
              <Index each={range(6)}>
                {(i) => <PinInputInput index={i()} />}
              </Index>
            </PinInputControl>
            <PinInputHiddenInput />
          </PinInput>
          <p class="text-xs text-muted-foreground">
            Value:{" "}
            <span class="font-mono text-foreground">
              {otp().join("") || "—"}
            </span>
            {done() && (
              <span class="ml-2 text-success">complete: {done()}</span>
            )}
          </p>
        </div>
      </Section>
    </div>
  );
}
