import { useEffect, useRef, useState } from "react";
import "./App.css";
import styles from "./assets/css/search.module.css";
import { menus, type DataItem, type MenuItem } from "./data/menusData";
import SkeletonLoader from "./components/SkeletonLoader";
import rawData from "./data/data.json";   // Retrieve data from json file
import notFound from "../src/assets/images/not_found.png";
import HightLightedText from "./components/HightLightedText";  // Component to highlight search text
import CustomCursor from "./components/CustomCursor";  // Component for custom cursor

const importedData: DataItem[] = rawData;  // Converting json data into DataItem type 

function App() {
  const [originalSearchedData, setOriginalSearchedData] = useState<DataItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("");
  const [menu, setMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const [activeMenus, setActiveMenus] = useState<MenuItem[]>([
    menus[0],
    menus[1],
  ]);
  const [loader, setLoader] = useState(false);
  const [searchedData, setSearchedData] = useState<DataItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);



  // Funtion to active menus using checkboxes
  const handleMenuUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string
  ) => {
    if (e.target.checked) {
      setActiveMenus((prev) => [...prev, menus[index]]);
    } else {
      const menuIndex = activeMenus.findIndex((item) => item.name === name);
      if (menuIndex + 1 === activeIndex) {
        setActiveIndex(menuIndex);
      } else if (menuIndex + 1 < activeIndex) {
        setActiveIndex(menuIndex + 1);
      }
      setActiveMenus((prev) =>
        prev.filter((data) => data.name !== menus[index].name)
      );
    }
  };




  // Function to filter out searched data according the menus
  const handleSearchType = (index: number, type: string) => {
    setLoader(true);
    setActiveIndex(index);
    setSearchType(type);
    setSearchedData(
      importedData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          (type === "" || item.type === type)
      )
    );
    setTimeout(() => {
      setLoader(false);
    }, 3500);
  };


  // UseEffect function to fix menu when checkbox is unchecked
  useEffect(() => {
    if(activeMenus[activeIndex-1]){
      setSearchedData(
        importedData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) && item.type === activeMenus[activeIndex-1].type
        )
      )
    }else{
      setSearchedData(
        importedData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    }

    if (containerRef.current) {
      const categoryElements = containerRef.current.querySelectorAll(
        `.${styles.category}`
      );
      const activeElement = categoryElements[activeIndex] as HTMLElement;
      if (activeElement) {
        setLineStyle({
          width: activeElement.offsetWidth,
          left: activeElement.offsetLeft,
        });
      }
    }
  }, [activeIndex]);




  // useEffect function to perform search as per search value
  useEffect(() => {
    if (searchValue !== "") {
      setLoader(true);
    } else {
      setLoader(false);
    }
    setSearchedData(
      importedData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          (searchType === "" || item.type === searchType)
      )
    );
    setTimeout(() => {
      setOriginalSearchedData(
        importedData.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setLoader(false);
    }, 3000);
  }, [searchValue]);


  // Function to active loader when search data changes
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }, [searchedData]);



  // Hide menu when click outside menu
  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <section className={styles.search_container}>
        <div
          className={styles.search_wrapper}
          style={searchValue === "" ? { height: "75px" } : {}}
        >
          <div className={styles.search_bar_wrapper}>
            <div className={styles.input_wrapper}>
              {loader ? (
                <i
                  className={`fa-solid fa-circle-notch  ${styles.search_icon} ${styles.loading_icon}`}
                ></i>
              ) : (
                <i
                  className={`fa-solid fa-magnifying-glass ${styles.search_icon}`}
                ></i>
              )}
              <input
                className={styles.search_input}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                placeholder="Searching is easier"
              />
            </div>
            <div className={styles.input_content}>
              {searchValue !== "" ? (
                <button
                  type="button"
                  className={styles.clear_selection_btn}
                  onClick={() => {
                    setSearchValue("");
                  }}
                >
                  Clear
                </button>
              ) : (
                <>
                  <i
                    className={`fa-regular fa-circle-dot ${styles.content_icon}`}
                  ></i>
                  <p className={styles.content}>quick access</p>
                </>
              )}
            </div>
          </div>
          <div className={styles.list_container}>
            <div className={styles.list_wrapper}>
              <div className={styles.categories_wrapper} ref={containerRef}>
                <div
                  className={styles.active_line}
                  style={{ width: lineStyle.width, left: lineStyle.left }}
                ></div>
                <div
                  className={`${styles.category} ${
                    activeIndex === 0 ? styles.active : ""
                  }`}
                  onClick={() => {
                    handleSearchType(0, "");
                  }}
                >
                  <p className={styles.category_name}>All</p>
                  <p className={styles.category_number}>
                    {originalSearchedData.length}
                  </p>
                </div>
                {activeMenus.map((menu, index) => {
                  return (
                    <div
                      key={index}
                      className={`${styles.category} ${
                        activeIndex === index + 1 ? styles.active : ""
                      }`}
                      onClick={() => {
                        handleSearchType(index + 1, menu.type);
                      }}
                    >
                      <i className={menu.icon}></i>
                      <p className={styles.category_name}>{menu.name}</p>
                      <p className={styles.category_number}>
                        {
                          originalSearchedData.filter(
                            (item) => item.type === menu.type
                          ).length
                        }
                      </p>
                    </div>
                  );
                })}
              </div>
              <div ref={menuRef} className={styles.setting_container}>
                <i
                  className="fa-solid fa-gear"
                  onClick={() => {
                    setMenu(!menu);
                  }}
                ></i>
                <div
                  className={styles.setting_menu_container}
                  style={{
                    height: `${menu ? "168px" : "0px"}`,
                    visibility: `${menu ? "visible" : "hidden"}`,
                    opacity: `${menu ? "1" : "0"}`,
                  }}
                >
                  <div className={styles.setting_menu_wrapper}>
                    {menus.map((menu, i) => {
                      return (
                        <div key={i} className={styles.menu_check_container}>
                          <div className={styles.menu_check_wrapper}>
                            <i className={menu.icon}></i>
                            <p className={styles.menu_name}>{menu.name}</p>
                          </div>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                handleMenuUpdate(e, i, menu.name);
                              }}
                              defaultChecked={menu.checked}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.item_list_wrapper}
              style={
                !searchedData.length && !loader
                  ? { display: "grid", placeItems: "center" }
                  : {}
              }
            >
              {!searchedData.length && !loader ? (
                <div className={styles.not_found_image_wrapper}>
                  <h2 className={styles.not_found_heading}>No Item Found</h2>
                  <img src={notFound} className={styles.not_found_image} alt="" />
                </div>
              ) : (
                <div className={styles.items_list}>
                  {loader ? (
                    <>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                      <div className={styles.item_wrapper}>
                        <SkeletonLoader />
                      </div>
                    </>
                  ) : (
                    searchedData.map((item, index) => (
                      <div key={index} className={styles.item_wrapper}>
                        <div className={styles.item}>
                          <div className={styles.item_content_wrapper}>
                            <div className={styles.image_container}>
                              <div className={styles.image_wrapper}>
                                {
                                  item.type === 'user'?
                                  <img
                                    src={item.image}
                                    className={styles.image}
                                    alt={item.name}
                                  />:
                                  item.sub_type === 'folder'?
                                  <i className="fa-solid fa-folder"></i>:
                                  item.sub_type === 'image'?
                                  <i className="fa-solid fa-image"></i>:
                                  item.sub_type === 'video'?
                                  <i className="fa-solid fa-play"></i>:
                                  <i className="fa-solid fa-file"></i>

                                }
                              </div>
                              {item.type === "user" && (
                                <div
                                  className={styles.status}
                                  style={
                                    item.active_status === "active"
                                      ? { background: "var(--success-color)" }
                                      : item.active_status === "away"
                                      ? { background: "var(--warning-color)" }
                                      : { background: "var(--danger-color)" }
                                  }
                                ></div>
                              )}
                            </div>
                            <div className={styles.list_item_content}>
                              <h3>{HightLightedText(item.name, searchValue)}</h3>
                              <p>{item.status}</p>
                            </div>
                          </div>
                          <div className={styles.link_container}>
                            <i
                              className={`fa-solid fa-link ${styles.link_option}`}
                            ></i>
                            <div className={styles.new_tab_option_wrapper}>
                              <i className="fa-solid fa-arrow-up-right-from-square"></i>
                              <p>New Tab</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
