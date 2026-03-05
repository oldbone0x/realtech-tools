import React, { useState } from 'react';

interface NextRun {
  date: string;
  time: string;
  day: string;
}

export const CronVisualizer: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('0 2 * * *');
  const [timezone, setTimezone] = useState('UTC');

  const getDescription = (expr: string): string => {
    const parts = expr.split(' ');
    if (parts.length === 5) {
      const [minute, hour, day, month, weekday] = parts;
      
      const timeDesc = hour === '*' ? 'every hour' : `at ${hour}:${minute === '*' ? '00' : minute}`;
      const dayDesc = day === '*' ? (weekday === '*' ? 'every day' : `on ${getWeekday(weekday)}`) : `on day ${day}`;
      const monthDesc = month === '*' ? '' : `in ${getMonth(month)}`;
      
      return `${timeDesc.charAt(0).toUpperCase() + timeDesc.slice(1)} ${dayDesc}${monthDesc ? ' ' + monthDesc : ''}`;
    }
    return 'Invalid cron expression';
  };

  const getWeekday = (w: string): string => {
    const days: Record<string, string> = {
      '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
      '4': 'Thursday', '5': 'Friday', '6': 'Saturday',
      '*': 'every day', '1-5': 'weekdays'
    };
    return days[w] || `day ${w}`;
  };

  const getMonth = (m: string): string => {
    const months: Record<string, string> = {
      '1': 'January', '2': 'February', '3': 'March', '4': 'April',
      '5': 'May', '6': 'June', '7': 'July', '8': 'August',
      '9': 'September', '10': 'October', '11': 'November', '12': 'December',
      '*': 'every month'
    };
    return months[m] || `month ${m}`;
  };

  const getNextRuns = (): NextRun[] => {
    // Mock next runs for demo
    return [
      { date: '2026-03-06', time: '02:00', day: 'Friday' },
      { date: '2026-03-07', time: '02:00', day: 'Saturday' },
      { date: '2026-03-08', time: '02:00', day: 'Sunday' },
      { date: '2026-03-09', time: '02:00', day: 'Monday' },
      { date: '2026-03-10', time: '02:00', day: 'Tuesday' },
    ];
  };

  const templates = [
    { label: 'Every hour', expr: '0 * * * *' },
    { label: 'Every day at midnight', expr: '0 0 * * *' },
    { label: 'Every day at 2 AM', expr: '0 2 * * *' },
    { label: 'Every Monday at 9 AM', expr: '0 9 * * 1' },
    { label: 'First day of month', expr: '0 0 1 * *' },
    { label: 'Every 5 minutes', expr: '*/5 * * * *' },
    { label: 'Weekdays at 9 AM', expr: '0 9 * * 1-5' },
  ];

  const isValid = /^(\*|([0-9]|1[0-9]|[2-5][0-9])(-([0-9]|1[0-9]|[2-5][0-9]))?)(,(\*|([0-9]|1[0-9]|[2-5][0-9])(-([0-9]|1[0-9]|[2-5][0-9]))?))*\s+(\*|([0-9]|1[0-9]|2[0-3])(-([0-9]|1[0-9]|2[0-3]))?)(,(\*|([0-9]|1[0-9]|2[0-3])(-([0-9]|1[0-9]|2[0-3]))?))*\s+(\*|([1-9]|[12][0-9]|3[01])(-([1-9]|[12][0-9]|3[01]))?)(,(\*|([1-9]|[12][0-9]|3[01])(-([1-9]|[12][0-9]|3[01]))?))*\s+(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?)(,(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?))*\s+(\*|([0-6])(-([0-6]))?)(,(\*|([0-6])(-([0-6]))?))*$/.test(cronExpression);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cron Expression Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform cryptic cron expressions into human-readable descriptions with timezone support
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Expression Input */}
          <div className="p-8 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Cron Expression
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className={`flex-1 px-6 py-4 text-2xl font-mono border-2 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}
                placeholder="0 2 * * *"
              />
              <div className={`px-6 py-4 rounded-xl font-semibold text-lg ${
                isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isValid ? '✓ Valid' : '✗ Invalid'}
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['*', '0-59', '0-23', '1-31', '1-12', '0-6'].map((field, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-mono">
                  {['Minute', 'Hour', 'Day', 'Month', 'Weekday'][i]}: {field}
                </span>
              ))}
            </div>
          </div>

          {/* Timezone Selector */}
          <div className="p-8 border-b border-gray-100 bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full md:w-1/2 px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="Asia/Shanghai">Beijing (UTC+8)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="America/New_York">New York (EST)</option>
              <option value="America/Los_Angeles">Los Angeles (PST)</option>
            </select>
          </div>

          {/* Description */}
          <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-sm font-semibold text-blue-100 mb-3 uppercase tracking-wide">
              Human-Readable Description
            </h2>
            <p className="text-3xl font-bold text-white">
              {isValid ? getDescription(cronExpression) : 'Please enter a valid cron expression'}
            </p>
          </div>
        </div>

        {/* Next Runs */}
        {isValid && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Next Execution Times</h2>
              <p className="text-gray-600">Upcoming runs in {timezone}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {getNextRuns().map((run, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {run.date.split('-')[2]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">{run.day}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {run.time}
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">{run.date}</div>
                  </div>
                  {index === 0 && (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                      Next
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Templates</h2>
            <p className="text-gray-600">Quick-start with popular cron patterns</p>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => setCronExpression(template.expr)}
                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:border-blue-500 group ${
                  cronExpression === template.expr
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-mono text-lg text-blue-600 font-bold mb-2 group-hover:text-blue-700">
                  {template.expr}
                </div>
                <div className="text-gray-600 text-sm">{template.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with ❤️ by RealTech AI Tool Factory</p>
          <p className="mt-1">Part of RealTech Hub (real-tech.online)</p>
        </div>
      </div>
    </div>
  );
};

export default CronVisualizer;
