const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

// ================= SAVE TOKENS =================
export const saveToken = (data) => {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
};

// Optional alias (old code support)
export const saveTokens = saveToken;

// ================= CLEAR TOKENS =================
export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// ================= GET ACCESS TOKEN =================
export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

// ================= REFRESH TOKEN =================
export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) return null;

    try {
        const res = await fetch(
            `${BASEURL}/api/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    refresh,
                }),
            }
        );

        if (!res.ok) {
            clearTokens();
            return null;
        }

        const data = await res.json();

        localStorage.setItem(
            "access_token",
            data.access
        );

        return data.access;

    } catch (error) {
        clearTokens();
        return null;
    }
};

// ================= AUTH FETCH =================
export const authFetch = async (
    url,
    options = {}
) => {
    let token = getAccessToken();

    const headers = {
        "Content-Type":
            "application/json",
        ...(options.headers || {}),
        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };

    let res = await fetch(url, {
        ...options,
        headers,
    });

    // Token expired
    if (res.status === 401) {
        token =
            await refreshAccessToken();

        if (!token) return res;

        res = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return res;
};