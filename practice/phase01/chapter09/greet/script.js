// 1. 함수 기본 실습 (매개변수와 반환값)
function greet(name) {
    return `안녕하세요, ${name}님! 환영합니다.`;
}

const message = greet('김코딩');
console.log(message); // 콘솔창 확인용

// 화면에 인사말 출력하기
const greetingBox = document.getElementById('greeting-box');
greetingBox.innerHTML = `<p><strong>${message}</strong></p>`;


// 2. 객체(Object)와 배열(Array) 데이터 구조
const users = [
    { id: 1, name: '김철수', age: 25, isActive: true },
    { id: 2, name: '이영희', age: 30, isActive: false },
    { id: 3, name: '박민수', age: 28, isActive: true },
    { id: 4, name: '최지우', age: 24, isActive: false }
];


// 3. map() 활용: 모든 회원의 정보를 HTML 문자열 배열로 변환
const userListEl = document.getElementById('user-list');
const userHtmls = users.map(user => {
    return `<li>이름: ${user.name} / 나이: ${user.age}세</li>`;
});
userListEl.innerHTML = userHtmls.join(''); // 배열을 하나의 문자열로 합쳐서 화면에 출력


// 4. filter() 활용: isActive가 true인 활성 회원만 골라내기
const activeUserListEl = document.getElementById('active-user-list');
const activeUsers = users.filter(user => user.isActive);

const activeUserHtmls = activeUsers.map(user => {
    return `<li>활성 회원 이름: ${user.name}</li>`;
});
activeUserListEl.innerHTML = activeUserHtmls.join('');

// 1. HTML의 input과 button 요소를 자바스크립트로 가져옵니다.
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const confirmButton = document.getElementById('btn');

// 2. 확인 버튼에 'click' 이벤트 리스너를 추가합니다.
confirmButton.addEventListener('click', () => {
    // 3. input창에 입력된 값(value)을 가져옵니다.
    const nameValue = nameInput.value;
    const ageValue = ageInput.value;

    // 4. 입력값이 비어있는지 확인하고 alert로 띄웁니다.
    if (nameValue.trim() === '') {
        alert('이름을 입력해주세요!');
    } else if (ageValue.trim() === '') {
        alert('나이를 입력해주세요!');
    } else {
const lastId = users.length > 0 ? users[users.length - 1].id : 0;
        const newId = lastId + 1;

        // ② 새로 입력받은 데이터로 객체 만들기
        const newUser = {
            id: newId,                 // 마지막 회원 id + 1 적용
            name: nameValue,           // input에 입력한 이름
            age: Number(ageValue),     // input에 입력한 나이 (숫자로 변환)
            isActive: true             // 새로 가입한 회원은 활성 상태(true)로 설정
        };

        // ③ users 배열에 새 회원 객체 추가하기 (.push() 메서드 사용)
        users.push(newUser);

        // ④ 화면 리스트 다시 그리기
        renderUsers();

        // alert(`이름 : ${nameValue}, 나이 : ${ageValue}세`);
        // console.log(`이름 : ${nameValue}, 나이 : ${ageValue}세`);

        const msg = greet(nameValue);
        greetingBox.innerHTML = `<p><strong>${msg}</strong></p>`;
    }
});