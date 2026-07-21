import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration=readFileSync(resolve(process.cwd(),"../../supabase/migrations/004_content_catalog.sql"),"utf8");

describe("Supabase content catalog migration",()=>{
  it("seeds the initial worlds and keeps the catalog idempotent",()=>{
    expect(migration).toContain("('culture','文化万象'");
    expect(migration).toContain("('common','公考常识'");
    expect(migration).toContain("on conflict (id) do update");
  });

  it("contains the complete initial question bank and no server-side content source",()=>{
    expect((migration.match(/insert into public\.questions/g)??[]).length).toBe(6);
    expect((migration.match(/insert into public\.knowledge_points/g)??[]).length).toBe(1);
    expect(migration).toContain("'common-boss'");
    expect(migration).toContain("'idiom-boss'");
  });
});
