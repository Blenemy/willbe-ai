import React from "react";

const handler = {
  get: (_: unknown, prop: string) => {
    return () => <svg data-testid={`mock-${prop.toLowerCase()}`} />;
  },
};

module.exports = new Proxy({}, handler);
