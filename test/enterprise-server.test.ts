import { describe, expect, it } from "vitest";
import fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";

import { enterpriseServer316Admin } from "../src/index.ts";

describe("enterpriseCloud plugin", () => {
  it("README example", async () => {
    const mock = fetchMock
      .sandbox()
      .post("https://github.acme-inc.com/api/v3/admin/users", [{ ok: true }], {
        body: {
          username: "octocat",
          email: "octocat@acme-inc.com",
        },
      });

    const MyOctokit = Octokit.plugin(enterpriseServer316Admin);
    const octokit = new MyOctokit({
      auth: "secret123",
      baseUrl: "https://github.acme-inc.com/api/v3",
      request: {
        fetch: mock,
      },
    });

    // https://docs.github.com/en/enterprise-server@2.22/rest/reference/enterprise-admin#create-a-user
    const { data } = await octokit.enterpriseAdmin.createUser({
      username: "octocat",
      email: "octocat@acme-inc.com",
    });

    expect(data).toEqual([{ ok: true }]);
  });
});
