(function(){
  const input = document.getElementById('word');
  const btn = document.getElementById('checkBtn');
  const errorMsg = document.getElementById('errorMsg');
  const result = document.getElementById('result');
  const outWord = document.getElementById('outWord');
  const outReversed = document.getElementById('outReversed');
  const verdictText = document.getElementById('verdictText');
  const verdictRing = document.getElementById('verdictRing');

  function reverseString(str){
    return str.split('').reverse().join('');
  }

  function showError(message){
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    result.classList.remove('show');
    verdictRing.classList.remove('animate');
  }

  function clearError(){
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
  }

  function checkPalindrome(){
    const raw = input.value.trim();
    clearError();

    if (raw === ''){
      showError('Enter a word to check.');
      return;
    }
    if (!/^[A-Za-z]+$/.test(raw)){
      showError('Only letters are allowed, no spaces or symbols.');
      return;
    }
    if (raw.length < 3){
      showError('Enter at least 3 letters.');
      return;
    }
    if (raw.length > 20){
      showError('Keep it to 20 letters or fewer.');
      return;
    }

    const lower = raw.toLowerCase();
    const reversed = reverseString(lower);
    const isPalindrome = lower === reversed;

    outWord.textContent = raw;
    outReversed.textContent = reverseString(raw);

    verdictText.textContent = isPalindrome ? 'Palindrome' : 'Not a palindrome';
    verdictText.classList.toggle('yes', isPalindrome);
    verdictText.classList.toggle('no', !isPalindrome);

    result.classList.remove('show');
    verdictRing.classList.remove('animate');
    // restart the ring-drawing animation on every check
    void result.offsetWidth;
    result.classList.add('show');
    if (isPalindrome){
      verdictRing.classList.add('animate');
    }
  }

  btn.addEventListener('click', checkPalindrome);
  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter'){ checkPalindrome(); }
  });
})();