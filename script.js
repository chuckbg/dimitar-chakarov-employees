function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value, enumerable: true, configurable: true, writable: true
        });
    } else {
        obj[key] = value;
    } return obj;
}

function buildFileSelector() {
  const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', '.txt');
    fileSelector.addEventListener('change', function (e) {
    var file = fileSelector.files[0];
    var textType = /text.*/;
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    if (file.type.match(textType)) {
      var reader = new FileReader();
      document.getElementById('Btn').innerText = "Clear results";
      fileDisplayArea.innerText = file.name;
      reader.onload = function () {//Parse CSV file and split on new line
        var dataArr = reader.result.split("\n"); //for each line in array
        var Emp = [];
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        dataArr.forEach(function (rowArr, i) {
          if (rowArr != "") {//not eof => create row
            var tbodyRef = document.getElementById('theInBody');
            var newRow = tbodyRef.insertRow();
            var valArr = rowArr.split(",");
            Emp.push([0, 0, 0, 0]);
            valArr.forEach(function (val, j) {
              val = val.trim();
              var newCell = newRow.insertCell();
              var newText = document.createTextNode(val);
              newCell.appendChild(newText);
              if (j < 2) {
                Emp[i][j] = parseInt(val);
              } else {
                if (val == "NULL") {
                  Emp[i][j] = Math.round(new Date().getTime() / millisecondsPerDay); //days after 01/01/1970
                } else {
                    Emp[i][j] = Math.round(Date.parse(val) / millisecondsPerDay); //days after 01/01/1970
                }
              }
            });
          }
        });

        var Days = []; //Calculate days together
        var k = 0;
        for (var i = 0; i < Emp.length - 1; i++) {
          for (var j = i + 1; j < Emp.length; j++) {
            Days.push([Emp[i][0], Emp[j][0], Emp[i][1], 0]);
            if (Emp[i][1] == Emp[j][1]) {//same project
              if (Emp[i][2] == Emp[j][3] || Emp[j][2] == Emp[i][3]) {//beg of 1st == end of compared or beg of compared == end of 1st
                Days[k][3] = 1;
              } else if (Emp[i][2] < Emp[j][3] && Emp[j][2] < Emp[i][3]) {//beg of 1st < end of compared and beg of compared < end of 1st
                  Days[k][3] = Math.round(Math.min(Emp[i][3], Emp[j][3])) - Math.round(Math.max(Emp[i][2], Emp[j][2])) + 1; //min(end) - max(beg) +1
              }
            }
            k++;
          };
        };

        Days.sort(function (a, b) {
          return b[3] - a[3];
        });
        var day = Days[0][3];
        if (day > 0) {
          var Dayss = Days.filter(d => d[3] == day);
          Dayss.forEach(Row => {
            var tbodyRef = document.getElementById('theOutBody');
            var newRow = tbodyRef.insertRow();
            Row.forEach(val => {
              var newCell = newRow.insertCell();
              var newText = document.createTextNode(val);
              newCell.appendChild(newText);
            });
          });
        } else {
          document.getElementById('msgDisplayArea').innerText = "There are no co-workers in any project...";
        };

      };
      reader.readAsText(file);
    } else {
      fileDisplayArea.innerText = "File not supported!";
    }
  });
  return fileSelector;
}

class FileDialogue extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "handleFileSelect",
    e => {
        e.preventDefault();
        if (document.getElementById('Btn').innerText == "Clear results") {
            window.location.reload(true);
        } else {
            this.fileSelector.click();
        }
    });}componentDidMount() {this.fileSelector = buildFileSelector();}
  render() {
      return /*#__PURE__*/React.createElement("a", { id: "Btn", className: "button", href: "", onClick: this.handleFileSelect }, "Select file");
  }}


ReactDOM.render( /*#__PURE__*/React.createElement(FileDialogue, null), document.getElementById('app'));

window.onload = function () {
};