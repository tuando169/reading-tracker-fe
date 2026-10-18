export const apiEndpoints = {
  books: {
    base: "/books",

    get getAll() {
      return this.base;
    },

    getDetail(id: number | string) {
      return `${this.base}/${id}`;
    },
  },

  library: {
    base: "/library",

    get getAll() {
      return this.base;
    },

    get create() {
      return this.base;
    },

    patch() {
      return this.base;
    },

    delete(id: string) {
      return this.base + "/" + id;
    },
  },
};
