import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, RotateCcw } from 'lucide-react';
import { TimerSettings } from '@/hooks/useTimer';
import { useToast } from '@/hooks/use-toast';
import { AppearanceSettings } from './AppearanceSettings';

interface SettingsDialogProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
  phase: 'work' | 'shortBreak' | 'longBreak';
}

export const SettingsDialog = ({ settings, onSave, phase }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [workInput, setWorkInput] = useState(settings.workDuration.toString());
  const [shortBreakInput, setShortBreakInput] = useState(settings.shortBreakDuration.toString());
  const [longBreakInput, setLongBreakInput] = useState(settings.longBreakDuration.toString());
  const [sessionsInput, setSessionsInput] = useState(settings.workSessionsBeforeLongBreak.toString());

  const handleSave = () => {
    // Validate inputs
    const work = parseInt(workInput);
    const shortBreak = parseInt(shortBreakInput);
    const longBreak = parseInt(longBreakInput);
    const sessions = parseInt(sessionsInput);

    if (!workInput || isNaN(work) || work < 1 || work > 60) {
      toast({
        title: "Invalid Work Duration",
        description: "Work duration must be between 1 and 60 minutes",
        variant: "destructive",
      });
      return;
    }

    if (!shortBreakInput || isNaN(shortBreak) || shortBreak < 1 || shortBreak > 30) {
      toast({
        title: "Invalid Short Break Duration",
        description: "Short break duration must be between 1 and 30 minutes",
        variant: "destructive",
      });
      return;
    }

    if (!longBreakInput || isNaN(longBreak) || longBreak < 1 || longBreak > 60) {
      toast({
        title: "Invalid Long Break Duration",
        description: "Long break duration must be between 1 and 60 minutes",
        variant: "destructive",
      });
      return;
    }

    if (!sessionsInput || isNaN(sessions) || sessions < 1 || sessions > 10) {
      toast({
        title: "Invalid Sessions Count",
        description: "Sessions before long break must be between 1 and 10",
        variant: "destructive",
      });
      return;
    }

    // All valid, save settings
    onSave({
      ...tempSettings,
      workDuration: work,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
      workSessionsBeforeLongBreak: sessions,
    });
    setOpen(false);
  };

  const handleCompleteReset = () => {
    localStorage.clear();
    window.location.reload();
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
      <DialogContent 
        className="sm:max-w-[425px] bg-card border-border max-h-[85vh] flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Customize your Pomodoro timer and appearance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="timer" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="appearance">Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="flex-1 mt-0">
            <ScrollArea className="h-[55vh] pr-2 overflow-y-auto mt-4">
              <div className="grid gap-6 py-4 pr-4">
            <div className="grid gap-2">
              <Label htmlFor="work">Work Duration (minutes)</Label>
              <Input
                id="work"
                type="number"
                min="1"
                max="60"
                value={workInput}
                onChange={(e) => setWorkInput(e.target.value)}
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
                value={shortBreakInput}
                onChange={(e) => setShortBreakInput(e.target.value)}
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
                value={longBreakInput}
                onChange={(e) => setLongBreakInput(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sessionsBeforeLongBreak">
                Work Sessions Before Long Break
                <span className="text-xs text-muted-foreground ml-1">(work only, excludes breaks)</span>
              </Label>
              <Input
                id="sessionsBeforeLongBreak"
                type="number"
                min="1"
                max="10"
                value={sessionsInput}
                onChange={(e) => setSessionsInput(e.target.value)}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="brownNoise" className="flex-1">
                Brown Noise (Work Phase)
              </Label>
              <Switch
                id="brownNoise"
                checked={tempSettings.brownNoiseEnabled}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, brownNoiseEnabled: checked })
                }
                style={{
                  backgroundColor: tempSettings.brownNoiseEnabled ? phaseColors[phase] : undefined,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoDarkMode" className="flex-1">
                Auto Dark Mode (after 10s)
              </Label>
              <Switch
                id="autoDarkMode"
                checked={tempSettings.autoDarkMode}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, autoDarkMode: checked })
                }
                style={{
                  backgroundColor: tempSettings.autoDarkMode ? phaseColors[phase] : undefined,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="screenDimming" className="flex-1">
                Screen Dimming (Battery Saver)
              </Label>
              <Switch
                id="screenDimming"
                checked={tempSettings.screenDimming}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, screenDimming: checked })
                }
                style={{
                  backgroundColor: tempSettings.screenDimming ? phaseColors[phase] : undefined,
                }}
              />
            </div>
            
                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Everything
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Everything?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will clear all your settings, progress, and stored data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCompleteReset}>
                          Yes, reset everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="appearance" className="flex-1 mt-0">
            <ScrollArea className="h-[55vh] pr-2 overflow-y-auto mt-4">
              <div className="pr-4">
                <AppearanceSettings />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="font-semibold"
            style={{
              backgroundColor: phaseColors[phase],
              color: 'black',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
              boxShadow: `0 0 15px ${phaseColors[phase]}66, 0 2px 8px rgba(0, 0, 0, 0.1)`,
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
