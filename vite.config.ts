import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function localInquiryApi(): Plugin {
  return {
    name: "local-inquiry-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/inquiries", async (req, res, next) => {
        if (req.url !== "/" && req.url !== "") return next();
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(Buffer.from(chunk));
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (typeof value === "string") headers.set(name, value);
          }
          const { default: handler } = await server.ssrLoadModule("/api/inquiries.ts");
          const response: Response = await handler.fetch(new Request("http://localhost/api/inquiries", {
            method: req.method,
            headers,
            body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
          }));
          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), "TURSO_");
  for (const [name, value] of Object.entries(serverEnv)) {
    process.env[name] ??= value;
  }
  return {
    server: { host: "::", port: 8080 },
    plugins: [react(), localInquiryApi()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  };
});
