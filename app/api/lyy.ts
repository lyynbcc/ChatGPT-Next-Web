import { getServerSideConfig } from "@/app/config/server";
import { LYY_BASE_URL, ApiPath, ModelProvider } from "@/app/constant";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

const serverConfig = getServerSideConfig();

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Lyy] Request:", {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    searchParams: Object.fromEntries(req.nextUrl.searchParams.entries()),
  });

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.Ernie);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  // if (!serverConfig.baiduApiKey || !serverConfig.baiduSecretKey) {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       message: `missing BAIDU_API_KEY or BAIDU_SECRET_KEY in server env vars`,
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  try {
    // 获取查询参数
    const searchParams = req.nextUrl.searchParams;
    const path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Lyy, "");

    // 构建目标 URL
    let baseUrl = LYY_BASE_URL;
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const targetUrl = `${baseUrl}${path}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;

    console.log("[Lyy] Forwarding to:", targetUrl);

    // 构建请求配置
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        Authorization: req.headers.get("Authorization") || "",
        Access_token: req.headers.get("Access_token") || "",
        "Content-Type": "application/json",
      },
    };

    // 如果是 POST 请求，添加 body
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        fetchOptions.body = JSON.stringify(await req.json());
      } else {
        fetchOptions.body = await req.text();
      }
    }

    // 转发请求
    const response = await fetch(targetUrl, fetchOptions);

    // 返回响应
    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (e) {
    console.error("[Lyy] Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
