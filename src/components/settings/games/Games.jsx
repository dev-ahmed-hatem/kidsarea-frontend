import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import GameForm from "./GameForm";
import { fetch_list_data } from "../../../config/actions";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";

const Games = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { has_permission } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const [app_label, model_name, perm_name] = ["games", "games", "game"];

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                "تعديل فئة",
                MdEdit,
                <GameForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_games();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف فئة",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف اللعبة"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_games();
                        }}
                        toastMessage={"تم حذف اللعبة بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_games = () => {
        const searchURL = `${endpoints.game_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;

        fetch_list_data({
            searchURL: searchURL,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (has_permission(`${app_label}.${model_name}`, `${model_name}.view_${perm_name}`)) {
            get_current_games();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {has_permission(
                `${app_label}.${model_name}`,
                `${model_name}.add_${perm_name}`
            ) ? (
                <GameForm
                    postURL={endpoints.game_list}
                    callBack={get_current_games}
                />
            ) : (
                <ErrorGroup title={"إضافة لعبة"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {has_permission(
                `${app_label}.${model_name}`,
                `${model_name}.view_${perm_name}`
            ) ? (
                <ViewGroup title={"الألعاب الحالية"}>
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <TableGroup
                                onChange={(event) => {
                                    setSearchParam(event.target.value);
                                    setPageNumber(1);
                                }}
                            >
                                {data.count == 0 ? (
                                    <Table.Body>
                                        <Table.Row className="text-lg text-center text-gray-800 py-3 font-bold bg-red-500">
                                            <Table.Cell>
                                                لا توجد بيانات
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ) : (
                                    <>
                                        <Table.Head>
                                            <Table.HeadCell>
                                                اسم اللعبة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                السعر
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((game) => {
                                                return (
                                                    <Table.Row
                                                        key={game.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {game.name ? (
                                                                game.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {game.price ? (
                                                                game.price
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <span className="flex text-xl gap-x-3">
                                                                {has_permission(
                                                                    `${app_label}.${model_name}`,
                                                                    `${model_name}.change_${perm_name}`
                                                                ) && (
                                                                    <MdEdit
                                                                        className="text-accent cursor-pointer"
                                                                        onClick={() => {
                                                                            handleDrawer(
                                                                                "edit",
                                                                                game
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                                {has_permission(
                                                                    `${app_label}.${model_name}`,
                                                                    `${model_name}.delete_${perm_name}`
                                                                ) && (
                                                                    <MdDelete
                                                                        className="text-secondary cursor-pointer"
                                                                        onClick={() => {
                                                                            handleDrawer(
                                                                                "delete",
                                                                                game
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            </span>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            })}
                                        </Table.Body>
                                    </>
                                )}
                            </TableGroup>

                            {data.total_pages > 1 && (
                                <TablePagination
                                    totalPages={data.total_pages}
                                    currentPage={data.current_page}
                                    onPageChange={(page) => setPageNumber(page)}
                                />
                            )}
                        </>
                    )}
                </ViewGroup>
            ) : (
                <ErrorGroup
                    title={"الألعاب الحالية"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Games;
