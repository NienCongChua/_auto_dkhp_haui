let getTime;
let getDay;
let data_;
let table = "";

const App = {
  url: location.host,
  socket: null,
  Connection(day_, time_) {
    let support = "MozWebSocket" in window ? "MozWebSocket" : "WebSocket" in window ? "WebSocket" : null;
    if (!support) {
      alert('Vui lòng cập nhật trình duyệt lên phiên bản mới nhất!');
      location.reload();
    } else {
      try {
        this.socket = new WebSocket(`wss://${this.url}/register`);
        this.socket.onopen = (event) => {
          console.log('Kết nối WebSocket đã được thiết lập.');
        };
        this.socket.onmessage = evt => {
          data_ = evt.data;
          let obj = null;
          try {
            obj = jQuery.parseJSON(evt.data);
            
            // Insert log to know where is can to run
            console.log('Lấy data thành công.');
            console.log('----------------------------------');
            console.log(data_);
          } catch (err) {
            obj.err = 1;
          }
          if (obj.err == 0) {
            switch (obj.msg) {
              case "skin":
                App.socket.send(`classbydate:${day_}:${time_}`);
                console.log('Socket was send!');
                break;
              case "addclass":
                location.reload();
                break;
              case "classbydate":
                data_ = JSON.parse(data_);

              /*create table data*/

                //create information for each sucject
                let temp = data_.data.map((item) => {
                  console.log('reate information for each sucject');
                  //create school days html
                  let address = item.lr.map((item) => {
                    console.log('create school days html');
                    let item_1 = `<span>Thứ(${item.Day}), Tiết(${item.Time}), Phòng ${item.Room}</span><br/>`;
                    console.log(item_1);
                    return item_1;
                  });
                  //end create school days html
                  let item_2 = `<tr><th scope="row">${item.mn}</th>
                                        <td>${item.cn}</td>
                                        <td>${address.join('')}</td>
                                        <td>${item.Total}/${item.MaxStudent}</td>
                                        <td>${item.ic}</td>
                                        <td><button name="${item.mn}" value=${item.ic} class="btn btn-primary choose">Đăng ký</button></td>
                                  </tr>`;
                  console.log(item_2);
                  return item_2;
                });
              //end create information for each sucject
                let tableForm = `<table class="table">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">Tên môn</th>
                                                      <th scope="col">Tên lớp</th>
                                                      <th scope="col">Thời gian và địa điểm học</th>
                                                      <th scope="col">Số lượng</th>
                                                      <th scope="col">ID</th>
                                                      <th></th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    ${temp.join('')}
                                                  </tbody>
                                                </table>`;
                document.querySelector("body > section > div > span").style.display = "none";
                document.querySelector("body > section > div").innerHTML = tableForm;
              /*end create table data*/

                //add event listener for each submit
                document.querySelectorAll("body > section > div > table > tbody > tr .choose").forEach((item) => {
                    item.addEventListener("click", function () {
                      let id = item.value;
                      if (confirm(`Xác nhận đăng ký ${item.name}? (Sau khi xác nhận, vui lòng đợi trang web tự động reload lại để hoàn tất đăng ký. Love all :/`)) {
                        App.socket.send(`addclass:${id}`);
                      }
                    });
                  });
                //end add
                break;
            }
          } else {
            alert(obj.data);
            console.log('alert(obj.data)');
          }
        };
      } catch (err) {
        alert(`Mất kết nối! Lỗi: ${err}`);
      }
    }
  },
};

//create form input
let createBox = () => {
  let box_content = `<div class="box">
                        <div class="box_get-data">
                          <form>
                            <div class="form-group d-flex align-items-center">
                            <label>Thời gian: </label>
                            <input type="text" class="form-control" id="dayIn" list="days" placeholder="Thứ" required>
                            <datalist id="days">
                                <option value="Thứ 2"></option>
                                <option value="Thứ 3"></option>
                                <option value="Thứ 4"></option>
                                <option value="Thứ 5"></option>
                                <option value="Thứ 6"></option>
                                <option value="Thứ 7"></option>
                                <option value="Chủ nhật"></option>
                            </datalist>
                            <input type="text" class="form-control" id="timeIn" list="time" placeholder="Buổi" required>
                            <datalist id="time">
                                <option value="Sáng"></option>
                                <option value="Chiều">Chiều</option>
                                <option value="Tối">Tối</option>
                            </datalist>
                            </div>
                            <input id="check" class="btn btn-success" type="button" value="Xem">
                            <input id="reset" class="btn btn-secondary" type="reset" value="Reset">
                          </form>
                        </div>
                        <div id="copy_right"><span>© 2024</span><a href="https://www.facebook.com/tac.ni.16" target="_blank">Richard Jacob</a></div>
                    </div>
                    `;

  let checkTemp = document.querySelector(
    "body > .be-wrapper > .be-left-sidebar"
  );
  if (checkTemp) {
    document.querySelector(".main-content.container-fluid").innerHTML = box_content;
  }
  let boxClassByDate = document.createElement("section");
  document.querySelector("body").appendChild(boxClassByDate);

};
//end create form input
createBox();

//get data
document
  .querySelector(".box .box_get-data #check")
  .addEventListener("click", function () {
    //get time data
    getDay = document.getElementById("dayIn").value;
    getTime = document.getElementById("timeIn").value;
    
    console.log(`Đang lấy dữ liệu ${getTime.toLowerCase()} ${getDay}...`);
    
    if(getDay){getDay = getDay == "Thứ 2" ? 2 : getDay == "Thứ 3" ? 3 : getDay == "Thứ 4" ? 4 : getDay == "Thứ 5" ? 5 : getDay == "Thứ 6" ? 6 : getDay == "Thứ 7" ? 7 : 1};
    if(getTime){getTime = getTime == "Sáng" ? 1 : getTime == "Chiều" ? 2 : 3};

    console.log(`Day: ${getDay}, Time: ${getTime}`);
    //end get time data

    App.Connection(getDay, getTime);//init ajax

    document.querySelector("body section").style.display = "flex";

    let span = document.createElement("span");
    document.querySelector("body > section").appendChild(span);

    let div = document.createElement("div");
    document.querySelector("body > section").appendChild(div);
    let span2 = document.createElement("span");
    document.querySelector("body > section > div").appendChild(span2);
    document.querySelector('body > section > div > span').innerHTML = `<div class="multi-spinner-container">
                                                                          <div class="multi-spinner">
                                                                              <div class="multi-spinner">
                                                                                  <div class="multi-spinner">
                                                                                      <div class="multi-spinner"></div>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>`
    
    document
      .querySelector("body > section > span")
      .addEventListener("click", function () {
        document.querySelector("body section").style.display = "none";
        document.querySelector("body section").removeChild(span);
        document.querySelector("body section").removeChild(div);
        htmlList = "";
      });
  });
