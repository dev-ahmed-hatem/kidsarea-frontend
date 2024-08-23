import React, { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, Datepicker } from "flowbite-react";
import Loading from "../groups/Loading";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../config/config";
import { fetch_list_data } from "../../config/actions";
import TicketCard from "./TicketCard";
// import SubscriptionCard from "./SubscriptionCard";

const TicketsFilterForm = ({ setLoading, setFetchError, setData }) => {
    const [post, setPost] = useState(false);
    const today = new Date().toLocaleDateString("en-CA");
    const {
        handleSubmit,
        formState: { errors },
        setError,
        control,
        watch,
        clearErrors,
    } = useForm({ defaultValues: { from: today, to: today } });
    const from = watch("from");
    const to = watch("to");

    useEffect(() => {
        if (to < from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
        } else {
            clearErrors();
        }
    }, [from, to]);

    const onSubmit = (data) => {
        if (data.to < data.from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
            return;
        }

        const url = `${endpoints.tickets_within_duration}from=${data.from}&to=${data.to}&no_pagination=true`;

        setPost(true);
        setLoading(true);
        fetch_list_data({
            searchURL: url,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: (_) => {
                setLoading(false);
                setPost(false);
            },
        });
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">
                تذاكر تم تسجيلها في الفترة :
            </h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="from" value="من :" />
                    </div>
                    <Controller
                        name="from"
                        control={control}
                        rules={{ required: "" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="from"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="تاريخ الميلاد"
                                color={"primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.from && (
                        <p className="error-message">{errors.from.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="to" value="إلى :" />
                    </div>
                    <Controller
                        name="to"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="to"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="تاريخ الميلاد"
                                color={errors.to ? "failure" : "primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.to && (
                        <p className="error-message">{errors.to.message}</p>
                    )}
                </div>

                <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                    <Button
                        type="submit"
                        color={"primary"}
                        disabled={post}
                        className="w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        isProcessing={post}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        بحث
                    </Button>
                </div>
            </form>
        </div>
    );
};

const TicketsFilter = () => {
    //////////////////////////////// list data ////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);

    return (
        <>
            {/* search form */}
            <TicketsFilterForm
                setLoading={setLoading}
                setFetchError={setFetchError}
                setData={setData}
            />

            {/* table data */}
            {(data || loading || fetchError) && (
                <div
                    className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                >
                    <h1 className="font-bold text-text text-lg">النتائج</h1>
                    <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <div className="tickets gap-y-6">
                                {data?.tickets?.length == 0 ? (
                                    <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                        لا توجد بيانات
                                    </p>
                                ) : (
                                    <>
                                        {Object.entries(data)?.map(
                                            ([day, value]) => (
                                                <div key={day} className="mb-14">
                                                    <h1 className="text-lg mb-6">
                                                        يوم :
                                                        <span className="text-primary font-bold">
                                                            {day}
                                                        </span>
                                                        <span className="block lg:mx-6 lg:inline-block">
                                                            عدد التذاكر:{" "}
                                                            <span className="text-primary font-bold">
                                                                {
                                                                    value.total_tickets
                                                                }
                                                            </span>
                                                        </span>
                                                        <span className="block lg:mx-6 lg:inline-block">
                                                            إجمالى السعر :{" "}
                                                            <span className="text-primary font-bold">
                                                                {
                                                                    value.total_price
                                                                }{" "}
                                                                جنيه
                                                            </span>
                                                        </span>
                                                    </h1>

                                                    <div className="subscriptions flex gap-x-4 lg:gap-x-10 gap-y-6 flex-wrap">
                                                        {value?.tickets?.length == 0 ? (
                                                            <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                                                لا توجد تذاكر
                                                            </p>
                                                        ) : (
                                                            <>
                                                                {value.tickets.map(
                                                                    (
                                                                        ticket
                                                                    ) => (
                                                                        <TicketCard
                                                                            key={
                                                                                ticket.id
                                                                            }
                                                                            ticket={
                                                                                ticket
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default TicketsFilter;
