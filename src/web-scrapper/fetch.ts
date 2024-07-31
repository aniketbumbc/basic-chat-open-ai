export const fetBooksApi = async () => {
  const url =
    'https://openlibrary.org/search.json?q=cricket&mode=everything&page=2';
  const bookList: any = [];
  const response = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const sliceBooks = data.docs.slice(0, 50);
      sliceBooks.forEach((book: any) => {
        bookList.push(book.title);
      });
    });
  return bookList;
};

fetBooksApi();
