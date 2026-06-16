import React from 'react';

export const EnvConfigCard: React.FC = () => {
  const env = import.meta.env;

  const getEnvBadgeStyle = (envName: string) => {
    switch (envName?.toLowerCase()) {
      case 'production':
        return { backgroundColor: '#ef4444', color: '#ffffff' };
      case 'demo':
        return { backgroundColor: '#f59e0b', color: '#ffffff' };
      case 'local':
      default:
        return { backgroundColor: '#10b981', color: '#ffffff' };
    }
  };

  const badgeStyle = getEnvBadgeStyle(env.VITE_ENV_NAME);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Environment Configuration</h2>
        <span style={{ ...styles.badge, ...badgeStyle }}>
          {env.VITE_ENV_NAME || 'Unknown'}
        </span>
      </div>
      
      <p style={styles.description}>
        This React app is compiled and running under the mode specified by your Vite build process.
      </p>

      <div style={styles.table}>
        <div style={styles.row}>
          <span style={styles.label}>Vite Mode (import.meta.env.MODE)</span>
          <code style={styles.code}>{env.MODE}</code>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>App Title (VITE_APP_TITLE)</span>
          <span style={styles.value}>{env.VITE_APP_TITLE}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>App Version (VITE_APP_VERSION)</span>
          <span style={styles.value}>{env.VITE_APP_VERSION}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Env Name (VITE_ENV_NAME)</span>
          <span style={styles.value}>{env.VITE_ENV_NAME}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>API Base URL (VITE_API_URL)</span>
          <code style={styles.code}>{env.VITE_API_URL}</code>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Debug Logs Enabled (VITE_ENABLE_DEBUG_LOGS)</span>
          <span style={{ 
            ...styles.value, 
            color: env.VITE_ENABLE_DEBUG_LOGS === 'true' ? '#10b981' : '#6b7280'
          }}>
            {env.VITE_ENABLE_DEBUG_LOGS}
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.hint}>
          Tip: Run <code>npm run build:demo</code> or <code>npm run build:prod</code> to switch environments.
        </span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '600px',
    margin: '30px auto',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    color: '#f3f4f6',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#ffffff',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  description: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  table: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  label: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  value: {
    fontSize: '14px',
    fontWeight: 500,
  },
  code: {
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#a7f3d0',
  },
  footer: {
    marginTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '12px',
  },
  hint: {
    fontSize: '12px',
    color: '#9ca3af',
  }
};
