// STEP 05: DOM 요소 선택 및 기본 상수/변수 선언
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const statusMessage = document.querySelector("#status-message");
const bookList = document.querySelector("#book-list");
const bookDetail = document.querySelector("#book-detail");
const bookForm = document.querySelector("#book-form");
const formMessage = document.querySelector("#form-message");

const SEARCH_API_URL = "https://openlibrary.org/search.json";
const POST_API_URL = "https://jsonplaceholder.typicode.com/posts";
let books = [];

// STEP 08: 상태별 렌더링 함수 구현 (Loading / Error / Empty)
function renderLoading() {
  statusMessage.textContent = "도서를 검색하는 중입니다...";
  bookList.innerHTML = "";
  bookDetail.textContent = "도서를 선택하세요.";
}

function renderError(message) {
  statusMessage.textContent = message;
  bookList.innerHTML = "";
  bookDetail.textContent = "도서를 선택하세요.";
}

function renderEmpty() {
  statusMessage.textContent = "검색 결과가 없습니다.";
  bookList.innerHTML = "";
  bookDetail.textContent = "도서를 선택하세요.";
}

// STEP 10: 도서 상세 정보 렌더링 함수
function renderBookDetail(book) {
  bookDetail.innerHTML = "";

  const title = book.title ? book.title : "-";
  const author = (book.author_name && book.author_name.length > 0) 
    ? book.author_name.join(", ") 
    : "저자 정보 없음";
  const year = book.first_publish_year ? book.first_publish_year : "-";
  const key = book.key ? book.key : "-";

  const titleEl = document.createElement("p");
  titleEl.textContent = `제목: ${title}`;

  const authorEl = document.createElement("p");
  authorEl.textContent = `저자: ${author}`;

  const yearEl = document.createElement("p");
  yearEl.textContent = `최초 출판연도: ${year}`;

  const keyEl = document.createElement("p");
  keyEl.textContent = `Open Library Key: ${key}`;

  bookDetail.append(titleEl, authorEl, yearEl, keyEl);
}

// STEP 09: 도서 목록 렌더링 함수
function renderBooks() {
  bookList.innerHTML = "";

  if (books.length === 0) {
    renderEmpty();
    return;
  }

  statusMessage.textContent = `검색 결과 ${books.length}권`;

  books.forEach((book) => {
    const li = document.createElement("li");
    const button = document.createElement("button");

    const author = (book.author_name && book.author_name.length > 0) 
      ? book.author_name.join(", ") 
      : "저자 정보 없음";
    
    const year = book.first_publish_year ? book.first_publish_year : "-";

    button.textContent = `${book.title} / ${author} (${year})`;

    button.addEventListener("click", () => {
      renderBookDetail(book);
    });

    li.appendChild(button);
    bookList.appendChild(li);
  });
}

// STEP 07: GET 도서 검색 함수 구현
async function searchBooks(keyword) {
  const url = `${SEARCH_API_URL}?q=${encodeURIComponent(keyword)}&limit=10&fields=key,title,author_name,first_publish_year`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP 에러 발생! 상태 코드: ${response.status}`);
  }

  const data = await response.json();
  return data.docs;
}

// STEP 11: 검색 Form Submit 이벤트 리스너
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const keyword = searchInput.value.trim();

  if (!keyword) {
    statusMessage.textContent = "검색어를 입력하세요.";
    return;
  }

  renderLoading();

  try {
    const resultDocs = await searchBooks(keyword);
    books = resultDocs;
    renderBooks();
  } catch (error) {
    console.error(error);
    renderError("도서를 불러오지 못했습니다.");
  }
});

// STEP 14: 도서 등록 POST 요청 함수 구현
async function createBookRequest(book) {
  const response = await fetch(POST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error(`POST 요청 실패! 상태 코드: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

// STEP 15: 도서 등록 Form Submit 이벤트 리스너 완성 (단일 리스너 유지)
bookForm.addEventListener("submit", async (event) => {
  // 1. preventDefault()
  event.preventDefault();

  // 2 & 3. FormData로 title / author 읽고 trim()
  const formData = new FormData(bookForm);
  const title = formData.get("title").trim();
  const author = formData.get("author").trim();

  // 4. 유효성 검증 (비어 있으면 안내 후 종료)
  if (!title || !author) {
    formMessage.textContent = "제목과 저자를 입력하세요.";
    return;
  }

  // 5. bookRequest Object 생성
  const bookRequest = {
    title: title,
    author: author,
  };

  // 6. 등록 요청 중 표시
  formMessage.textContent = "등록 요청 중...";

  try {
    // 7. await로 POST 요청 함수 호출
    const responseData = await createBookRequest(bookRequest);

    // 8 & 9. 성공 메시지 표시 및 Console에 Response 출력
    formMessage.textContent = "등록 요청이 성공했습니다.";
    console.log("POST Response:", responseData);

    // 10. 폼 초기화
    bookForm.reset();
  } catch (error) {
    // 11 & 12. 에러 로깅 및 실패 메시지 표시
    console.error(error);
    formMessage.textContent = "등록 요청에 실패했습니다.";
  }
});