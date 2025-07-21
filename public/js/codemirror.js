    
        // تهيئة محررات CodeMirror
        var htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
            mode: 'xml',
            theme: 'abbott',
            lineNumbers: true,
            matchBrackets: true
        });

        var cssEditor = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
            mode: 'css',
            theme: 'abbott',
            lineNumbers: true,
            matchBrackets: true
        });

        var jsEditor = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
            mode: 'javascript',
            theme: 'abbott',
            lineNumbers: true,
            matchBrackets: true
        });

        // دالة لإظهار المحرر المناسب
        function showEditor(type) {
            // إخفاء جميع المحررات والإطار
            htmlEditor.getWrapperElement().style.display = 'none';
            
            
            cssEditor.getWrapperElement().style.display = 'none';
            jsEditor.getWrapperElement().style.display = 'none';
            document.getElementById('output-frame').style.display = 'none';

            // إظهار المحرر المناسب
            if (type === 'html') {
                htmlEditor.getWrapperElement().style.display = 'block';
            } else if (type === 'css') {
                cssEditor.getWrapperElement().style.display = 'block';
            } else if (type === 'js') {
                jsEditor.getWrapperElement().style.display = 'block';
            } else if (type === 'output') {
                updateOutput();
                document.getElementById('output-frame').style.display = 'block';
            }
        }

        // دالة لتحديث الإخراج
        function updateOutput() {
            var html = htmlEditor.getValue();
            var css = `<style>${cssEditor.getValue()}</style>`;
            var js = `<script>${jsEditor.getValue()}<\/script>`;
            var content = html + css + js;
            var outputFrame = document.getElementById('output-frame');

            outputFrame.srcdoc = content;
        }

        // إخفاء جميع المحررات والإطار في البداية، وإظهار محرر HTML
        document.addEventListener('DOMContentLoaded', function () {
            showEditor('html'); // إظهار محرر HTML عند تحميل الصفحة
        });
    