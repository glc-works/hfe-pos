import { afterEach, describe, expect, it, vi } from "vitest";
import { proxyFirstPartyRequest } from "../../cloudflare/pagesProxy";
import { onRequest as proxyCoreRequest } from "../../functions/core/[[path]]";

describe("Cloudflare Pages first-party proxy", () => {
	afterEach(() => vi.restoreAllMocks());

	it("forwards the method, path, query, authorization, and body to the fixed origin", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response("{}"));
		const request = new Request(
			"https://prv-pos.hfeit.app/id/v1/auth/hcb-token?trace=1",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer opaque-session",
					"Content-Type": "application/json",
				},
				body: '{"organization_id":"demo"}',
			},
		);

		await proxyFirstPartyRequest(
			request,
			"https://account.togrow.id",
			["v1", "auth", "hcb-token"],
			["https://account.togrow.id"],
		);

		const forwarded = fetchSpy.mock.calls[0][0] as Request;
		expect(forwarded.url).toBe(
			"https://account.togrow.id/v1/auth/hcb-token?trace=1",
		);
		expect(forwarded.method).toBe("POST");
		expect(forwarded.headers.get("authorization")).toBe(
			"Bearer opaque-session",
		);
		expect(await forwarded.text()).toBe('{"organization_id":"demo"}');
	});

	it("fails closed when the Pages binding is absent or not an HTTPS origin", async () => {
		const request = new Request("https://prv-pos.hfeit.app/core/health");

		const allowedOrigins = ["https://prv-core.hfeit.com"];
		expect(
			(
				await proxyFirstPartyRequest(
					request,
					undefined,
					["health"],
					allowedOrigins,
				)
			).status,
		).toBe(503);
		expect(
			(
				await proxyFirstPartyRequest(
					request,
					"http://prv-core.hfeit.com",
					["health"],
					allowedOrigins,
				)
			).status,
		).toBe(503);
		expect(
			(
				await proxyFirstPartyRequest(
					request,
					"https://127.0.0.1",
					["health"],
					allowedOrigins,
				)
			).status,
		).toBe(503);
		expect(
			(
				await proxyFirstPartyRequest(
					request,
					"https://core.attacker.test",
					["health"],
					allowedOrigins,
				)
			).status,
		).toBe(503);
		expect(
			(
				await proxyFirstPartyRequest(
					request,
					"https://not-hfeit.com",
					["health"],
					allowedOrigins,
				)
			).status,
		).toBe(503);
	});

	it("does not follow redirects returned by the fixed upstream", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(null, {
					status: 302,
					headers: { Location: "http://169.254.169.254/" },
				}),
			);
		const request = new Request("https://prv-pos.hfeit.app/core/health");

		const response = await proxyFirstPartyRequest(
			request,
			"https://prv-core.hfeit.com",
			["health"],
			["https://prv-core.hfeit.com"],
		);

		expect(response.status).toBe(302);
		const forwarded = fetchSpy.mock.calls[0][0] as Request;
		expect(forwarded.redirect).toBe("manual");
	});

	it("rejects production CORE when invoked from the preview POS host", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");

		const response = await proxyCoreRequest({
			request: new Request("https://prv-pos.hfeit.app/core/health"),
			env: { HFE_CORE_ORIGIN: "https://core.hfeit.com" },
			params: { path: ["health"] },
		});

		expect(response.status).toBe(503);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it("rejects preview CORE when invoked from the production POS host", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");

		const response = await proxyCoreRequest({
			request: new Request("https://pos.hfeit.app/core/health"),
			env: { HFE_CORE_ORIGIN: "https://prv-core.hfeit.com" },
			params: { path: ["health"] },
		});

		expect(response.status).toBe(503);
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});
