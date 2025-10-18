import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { TimerSettings } from '@/hooks/useTimer';

interface SettingsDialogProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
  phase: 'work' | 'shortBreak' | 'longBreak';
}

export const SettingsDialog = ({ settings, onSave, phase }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    onSave(tempSettings);
    setOpen(false);
  };

  const phaseColors = {
    work: 'hsl(var(--work))',
    shortBreak: 'hsl(var(--short-break))',
    longBreak: 'hsl(var(--long-break))',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-card transition-colors duration-300"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Customize your Pomodoro timer preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="work">Work Duration (minutes)</Label>
            <Input
              id="work"
              type="number"
              min="1"
              max="60"
              value={tempSettings.workDuration}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, workDuration: parseInt(e.target.value) || 25 })
              }
              className="bg-background border-border"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortBreak">Short Break Duration (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="30"
              value={tempSettings.shortBreakDuration}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, shortBreakDuration: parseInt(e.target.value) || 5 })
              }
              className="bg-background border-border"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="longBreak">Long Break Duration (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min="1"
              max="60"
              value={tempSettings.longBreakDuration}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, longBreakDuration: parseInt(e.target.value) || 15 })
              }
              className="bg-background border-border"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStart" className="flex-1">
              Auto-start next phase
            </Label>
            <Switch
              id="autoStart"
              checked={tempSettings.autoStartNextPhase}
              onCheckedChange={(checked) =>
                setTempSettings({ ...tempSettings, autoStartNextPhase: checked })
              }
              style={{
                backgroundColor: tempSettings.autoStartNextPhase ? phaseColors[phase] : undefined,
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            style={{
              backgroundColor: phaseColors[phase],
              color: 'white',
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
