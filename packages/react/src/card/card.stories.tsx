import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from '../button/button';
import { Container, Stack } from '../layout/layout';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';
import { Input } from '../input/input';
import { Skeleton } from '../skeleton/skeleton';
import { TokenReference } from '../tokens/token-reference';

const meta = { title: 'Components/Card', component: Card, tags: ['autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

function SummaryCard() {
  const id = useId();
  return <Card asChild><article aria-labelledby={id}>
    <CardHeader>
      <CardTitle id={id} level={2}>Workspace activity</CardTitle>
      <CardDescription>This month's summary.</CardDescription>
    </CardHeader>
    <CardBody><p style={{ margin: 0 }}>24 projects completed / 8 active members</p></CardBody>
    <CardFooter><Button>View report</Button></CardFooter>
  </article></Card>;
}
export const Default: Story = {
  render: () => <div className="sbx-reference"><Container size="reading"><SummaryCard /></Container></div>,
};
function SettingsCard() {
  const id = useId();
  const [saved, setSaved] = useState(false);
  return <div className="sbx-reference"><Container size="reading"><Card asChild>
    <form aria-labelledby={id} onSubmit={event => { event.preventDefault(); setSaved(true); }} onReset={() => setSaved(false)}>
      <CardHeader><CardTitle id={id} level={2}>Workspace settings</CardTitle></CardHeader>
      <CardBody>
        <Field required><FieldLabel>Workspace name</FieldLabel><FieldControl><Input name="workspace" defaultValue="Design team" /></FieldControl><FieldDescription>Visible to everyone in your workspace.</FieldDescription></Field>
        <p role="status" style={{ margin: 0 }}>{saved ? 'Settings saved in this example.' : 'Changes are not persisted by this example.'}</p>
      </CardBody>
      <CardFooter><Button type="reset" variant="outline">Reset</Button><Button type="submit">Save changes</Button></CardFooter>
    </form>
  </Card></Container></div>;
}
export const Settings: Story = { render: () => <SettingsCard /> };
function LoadingCard() {
  const [loading, setLoading] = useState(true);
  const id = useId();
  return <div className="sbx-reference"><Container size="reading"><Stack>
    <Button onClick={() => setLoading(value => !value)}>{loading ? 'Show loaded content' : 'Show loading state'}</Button>
    <p role="status" style={{ margin: 0 }}>{loading ? 'Loading workspace details...' : 'Workspace details loaded.'}</p>
    <Card asChild><section aria-labelledby={id} aria-busy={loading}>
      <CardHeader><CardTitle id={id} level={2}>Workspace details</CardTitle><CardDescription>Current project summary</CardDescription></CardHeader>
      <CardBody>{loading ? <Skeleton lines={3} /> : <Stack gap="xs">
        <span>Design team</span><span>24 active projects</span><span>8 workspace members</span>
      </Stack>}</CardBody>
    </section></Card>
  </Stack></Container></div>;
}
export const Loading: Story = { render: () => <LoadingCard /> };
export const Tokens: Story = { render: () => <TokenReference owner="card" /> };
