import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { NavBar } from '../components/sasmster/NavBar'
import type { NavSection } from '@sasmaster/types'

const meta: Meta<typeof NavBar> = {
  title: 'SaSMaster/NavBar',
  component: NavBar,
  parameters: { backgrounds: { default: 'dark-cinematic' } },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

function NavBarWithState() {
  const [active, setActive] = useState<NavSection>('content')
  return <NavBar activeSection={active} onSectionChange={setActive} />
}

export const Default: Story = {
  render: () => <NavBarWithState />,
}
