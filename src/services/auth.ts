const SESSION_KEY = 'smartbi.demo.session';

export type AuthSession = {
  username: string;
};

function readSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawSession = window.sessionStorage.getItem(SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function writeSession(session: AuthSession | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function login(
  username: string,
  password: string,
): Promise<AuthSession> {
  if (username === 'demo' && password === '123456') {
    const session = { username };
    writeSession(session);
    return session;
  }

  throw new Error('账号或密码错误');
}

export function logout() {
  writeSession(null);
}

export function getCurrentSession() {
  return readSession();
}
