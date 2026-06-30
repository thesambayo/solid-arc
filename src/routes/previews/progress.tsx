import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";

import {
  Progress,
  ProgressLabel,
  ProgressRange,
  ProgressTrack,
  ProgressValueText,
} from "../../components/ui/progress";
import {
  Slider,
  SliderControl,
  SliderThumb,
} from "../../components/ui/slider";

export const Route = createFileRoute("/previews/progress")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      {props.children}
    </div>
  );
}

function RouteComponent() {
  const [value, setValue] = createSignal(40);

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Progress</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Displays an indicator showing the completion progress of a task.
        </p>
      </div>

      <Section title="Basic">
        <Progress value={33} class="max-w-sm">
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
      </Section>

      <Section title="With label and value">
        <Progress value={56} class="max-w-sm">
          <ProgressLabel>Upload progress</ProgressLabel>
          <ProgressValueText />
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
      </Section>

      <Section title="Min and max">
        <Progress value={20} min={10} max={30} class="max-w-sm">
          <ProgressLabel>Loading</ProgressLabel>
          <ProgressValueText />
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
      </Section>

      <Section title="Controlled">
        <div class="flex max-w-sm flex-col gap-4">
          <Progress value={value()}>
            <ProgressLabel>Completion</ProgressLabel>
            <ProgressValueText />
            <ProgressTrack>
              <ProgressRange />
            </ProgressTrack>
          </Progress>
          <Slider
            value={[value()]}
            onValueChange={(details) => setValue(details.value[0])}
          >
            <SliderControl>
              <SliderThumb index={0} />
            </SliderControl>
          </Slider>
        </div>
      </Section>

      <Section title="Indeterminate">
        <Progress value={null} class="max-w-sm">
          <ProgressLabel>Working…</ProgressLabel>
          <ProgressValueText />
          <ProgressTrack>
            <ProgressRange />
          </ProgressTrack>
        </Progress>
      </Section>
    </div>
  );
}
