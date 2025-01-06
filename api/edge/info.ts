export const config = {
    runtime: "edge"
};

export default async function handler() {
    return new Response(`
        <h1>API Information</h1>
        <p>Environment: ${process.env.NODE_ENV}</p>
        <p>App URL: ${process.env.APP_URL}</p>
    `, {
        headers: {
            "Content-Type": "text/html"
        }
    });
}
