import { motion } from 'framer-motion'
import BookMascot from '../components/common/BookMascot'
import useAppStore from '../store/useAppStore'

export default function Settings() {
  const { settings, updateSettings } = useAppStore()

  const SelectField = ({ label, value, options, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-light)] last:border-b-0">
      <label className="text-sm font-bold text-[var(--text-primary)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm px-4 py-2 rounded-xl border border-[var(--border-light)] bg-white text-[var(--text-primary)] font-medium cursor-pointer focus:outline-none focus:border-[var(--accent)] shadow-sm transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )

  const ToggleField = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-light)] last:border-b-0">
      <label className="text-sm font-bold text-[var(--text-primary)]">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors cursor-pointer border-none relative ${
          value ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white absolute top-0.5"
          animate={{ left: value ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        />
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
        
        {/* Mascot Header */}
        <BookMascot pose="idle" size={100} className="mb-4" />
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Settings</h1>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-8 text-center max-w-sm">
          Customize your learning experience with Gyan Saathi.
        </p>

        <div className="w-full space-y-6">
          
          <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-4">General Preferences</h2>
            <div className="flex flex-col">
              <SelectField
                label="Language"
                value={settings.language}
                onChange={(v) => updateSettings({ language: v })}
                options={[
                  { value: 'hinglish', label: 'Hinglish' },
                  { value: 'hindi', label: 'Hindi' },
                  { value: 'english', label: 'English' },
                ]}
              />
              <SelectField
                label="Default Class"
                value={settings.classLevel}
                onChange={(v) => updateSettings({ classLevel: parseInt(v) })}
                options={Array.from({ length: 7 }, (_, i) => ({
                  value: i + 6,
                  label: `Class ${i + 6}`,
                }))}
              />
              <SelectField
                label="Default Subject"
                value={settings.subject}
                onChange={(v) => updateSettings({ subject: v })}
                options={[
                  { value: 'Auto', label: 'Auto-detect' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'Science', label: 'Science' },
                  { value: 'English', label: 'English' },
                  { value: 'Hindi', label: 'Hindi' },
                  { value: 'Social Science', label: 'Social Science' },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-4">Voice Assistant</h2>
            <div className="flex flex-col">
              <SelectField
                label="Voice Speed"
                value={settings.voiceSpeed}
                onChange={(v) => updateSettings({ voiceSpeed: v })}
                options={[
                  { value: 'slow', label: 'Slow' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'fast', label: 'Fast' },
                ]}
              />
              <SelectField
                label="Voice Gender"
                value={settings.voiceGender}
                onChange={(v) => updateSettings({ voiceGender: v })}
                options={[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-4">Quiz Engine</h2>
            <div className="flex flex-col">
              <SelectField
                label="Default Difficulty"
                value={settings.difficulty}
                onChange={(v) => updateSettings({ difficulty: v })}
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' },
                ]}
              />
              <SelectField
                label="Default Question Count"
                value={settings.questionCount}
                onChange={(v) => updateSettings({ questionCount: parseInt(v) })}
                options={[
                  { value: 5, label: '5 Questions' },
                  { value: 10, label: '10 Questions' },
                  { value: 15, label: '15 Questions' },
                ]}
              />
              <ToggleField
                label="Smart Board Mode"
                value={settings.smartBoardMode}
                onChange={(v) => updateSettings({ smartBoardMode: v })}
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
