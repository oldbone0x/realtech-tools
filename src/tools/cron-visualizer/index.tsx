import React, { useState } from 'react';

export const CronVisualizer: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('0 2 * * *');
  const [timezone, setTimezone] = useState('UTC');

  const getDescription = (expr: string): string => {
    // Simple description generator (full implementation would use cron-parser)
    const parts = expr.split(' ');
    if (parts.length === 5) {
      const [minute, hour, day] = parts;
      return `At ${hour}:${minute}, on day ${day} of the month`;
    }
    return 'Invalid cron expression';
    return 'Invalid cron expression';
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Cron Expression Visualizer</h1>
      <p className="text-gray-600 mb-8">
        Visualize cron expressions with timezone support and human-readable descriptions.
      </p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Cron Expression</label>
        <input
          type="text"
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="0 2 * * *"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Shanghai">Beijing (UTC+8)</option>
          <option value="America/New_York">New York (EST)</option>
          <option value="Europe/London">London (GMT)</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 text-lg">{getDescription(cronExpression)}</p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a placeholder. Full implementation will include cron-parser library and next execution times.
        </p>
      </div>
    </div>
  );
};

export default CronVisualizer;
