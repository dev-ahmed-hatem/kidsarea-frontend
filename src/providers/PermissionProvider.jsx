import React, { useState, useEffect, createContext, useContext } from "react";
import Loading from "../components/groups/Loading";
import { set_page_permissions } from "../config/actions";

const PermissionContext = createContext();

const PermissionProvider = ({ children }) => {
    //////////////////////////////// handle permissions ////////////////////////////////
    const is_superuser = JSON.parse(localStorage.getItem("auth_user"))[
        "is_superuser"
    ];
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [permissions, setPermissions] = useState(null);

    useEffect(() => {
        set_page_permissions({
            setLoading: setLoading,
            setLoadError: setLoadError,
            setPermissions: setPermissions,
        });
    }, []);

    const has_permission = (model_name, perm) => {
        if (is_superuser) return true;        
        return permissions.includes(perm) ? true : false;
    };

    if (loading) return <Loading />;
    if (loadError)
        return (
            <p className="text-lg text-center text-red-600 py-4">
                خطأ في تحميل الصفحة
            </p>
        );

    return (
        <PermissionContext.Provider value={{ has_permission }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => useContext(PermissionContext);

export default PermissionProvider;
