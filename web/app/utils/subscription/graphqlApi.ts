// graphqlApi.ts
export const graphqlApiRequest = async (query: string, variables: any) => {
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
  
      const data = await response.json();
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }
      return data;
    } catch (error) {
      console.error("GraphQL API Error:", error);
      throw error;
    }
  };
  