import type { User } from './types';

// In a real app, you would use a secure, server-side hashing algorithm.
// For this simulation, we'll use a simple Base64 encoding to represent "hashing".
const fakeHash = (password: string): string => btoa(password);
const MOCK_DELAY = 500;
const USERS_STORAGE_KEY = 'pashudhan_users';
const CURRENT_USER_KEY = 'pashudhan_currentUser';


const getStoredUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const storeUsers = (users: User[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const signup = (username: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getStoredUsers();
            
            // Special case for simulated Google login
            if (password === 'google_oauth_token') {
                const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (existing) return resolve(existing);
                
                const newUser: User = {
                    id: `user_google_${Date.now()}`,
                    username,
                    email,
                    passwordHash: 'google_oauth_protected',
                };
                users.push(newUser);
                storeUsers(users);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
                return resolve(newUser);
            }

            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                return reject(new Error('Username already exists.'));
            }
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                return reject(new Error('Email is already registered.'));
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                username,
                email,
                passwordHash: fakeHash(password),
            };

            users.push(newUser);
            storeUsers(users);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
            resolve(newUser);
        }, MOCK_DELAY);
    });
};

const login = (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getStoredUsers();
            
            // Special case for simulated Google login
            if (password === 'google_oauth_token') {
                let user = users.find(u => u.email.toLowerCase() === username.toLowerCase());
                if (!user) {
                    // Auto-register google users for demo
                    user = {
                        id: `user_google_${Date.now()}`,
                        username: username.split('@')[0],
                        email: username,
                        passwordHash: 'google_oauth_protected',
                    };
                    users.push(user);
                    storeUsers(users);
                }
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                return resolve(user);
            }

            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

            if (user && user.passwordHash === fakeHash(password)) {
                 localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Invalid username or password.'));
            }
        }, MOCK_DELAY);
    });
};

const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

const changePassword = (username: string, currentPassword: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getStoredUsers();
            const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

            if (userIndex === -1) {
                return reject(new Error('User not found.'));
            }
            
            const user = users[userIndex];
            if (user.passwordHash !== fakeHash(currentPassword)) {
                return reject(new Error('Incorrect current password.'));
            }

            users[userIndex].passwordHash = fakeHash(newPassword);
            storeUsers(users);

            // Update current user session if it's the same user
            const currentUser = getCurrentUser();
            if(currentUser && currentUser.id === user.id) {
                 localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
            }

            resolve();
        }, MOCK_DELAY);
    });
};

const forgotPassword = (email: string): void => {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        // In a real app, this would trigger a secure email with a reset token.
        // For this simulation, we'll log it to the console.
        console.log(`Password reset requested for ${email}. A real email would be sent.`);
    } else {
        console.log(`Password reset requested for non-existent email: ${email}. No action taken.`);
    }
    // We don't give feedback to the user to prevent email enumeration attacks.
};


export const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
    changePassword,
    forgotPassword
};