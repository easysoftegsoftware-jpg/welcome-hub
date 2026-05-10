import React from "react";

const DropMenu = ()=>{
    return(
          <div class="dropdown-menu right_click_menu" id="right_click_menu">
                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addNewElement">إضافة عنصر</button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addRootElement">إضافة جزر</button>
                {/* <button class="dropdown-item">Separated link</button> */}
            </div>

    )
}

export default DropMenu;