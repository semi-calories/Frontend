//
//Tab관련된 context 모아놓는 파일
//

import React, { createContext, useState, useContext } from "react";

const TabContext = createContext({ opened:false, toggleOpened: () => {} })

export const TabContextProvider = ({ children }) => {
    const [opened, setOpened] = useState();

    const toggleOpened = () => {
        setOpened(!opened)
    }

    return (
        <TabContext.Provider value={{ opened, toggleOpened }}>
            {children}
        </TabContext.Provider>
    )
}

export const useTabMenu = () => useContext(TabContext)