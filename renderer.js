const queryResultDiv = document.getElementById('query-result');
const screenshotFeedbackDiv = document.getElementById('screenshot-feedback');

// 监听来自主进程的选定文本消息
window.electronAPI.onSelectedText((text) => {
    console.log('Received selected text in renderer:', text);
    queryResultDiv.textContent = `查询到的文本: ${text}`;
    // 在这里可以添加调用词典 API 的逻辑
    // fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
    //   .then(response => response.json())
    //   .then(data => {
    //      // 处理和显示词典数据
    //      queryResultDiv.textContent = `Definition for ${text}: ${data[0]?.meanings[0]?.definitions[0]?.definition || 'Not found'}`;
    //   })
    //   .catch(error => {
    //      console.error('Dictionary API error:', error);
    //      queryResultDiv.textContent = `Error fetching definition for ${text}`;
    //   });
});

// 监听截图成功的消息
window.electronAPI.onScreenshotTaken(() => {
    console.log('Screenshot taken feedback received.');
    screenshotFeedbackDiv.textContent = '截图已复制到剪贴板!';
    // 短暂显示后清除消息
    setTimeout(() => {
        screenshotFeedbackDiv.textContent = '';
    }, 3000); // 3秒后清除
});

console.log('renderer.js loaded');
