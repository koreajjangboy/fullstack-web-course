const calculateButton = document.getElementById("calculate");

calculateButton.addEventListener("click", function () {
    const num1Input = document.getElementById("num1").value.trim();
    const num2Input = document.getElementById("num2").value.trim();
    const operator = document.getElementById("operator").value;

    // 1. 빈 값 검사
    if (num1Input === "" || num2Input === "") {
        alert("두 숫자를 모두 입력해주세요.");
        return;
    }

    // 2. 숫자 검사
    const num1 = Number(num1Input);
    const num2 = Number(num2Input);

    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        alert("숫자만 입력해주세요.");
        return;
    }

    // 3. 나눗셈에서 분모가 0인지 검사
    // if (operator === "/" && num2 === 0) {
    //     alert("나눗셈에서는 분모에 0을 사용할 수 없습니다.");
    //     return;
    // }

    let result;

    if (operator === "+") {
        result = num1 + num2;
    } else if (operator === "-") {
        result = num1 - num2;
    } else if (operator === "*") {
        result = num1 * num2;
    } else if (operator === "/") {
        result = num1 / num2;
    }

    alert("결과: " + result);
});