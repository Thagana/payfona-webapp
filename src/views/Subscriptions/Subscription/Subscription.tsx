import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { Spin } from "antd";
import Axios from "../../../networking/adaptor";

import "./Subscription.scss";

type SubscriptionInputs = {
  email: string;
  plan: string;
};

type SubscriptionResponse = {
  data: {
    data: {
      id: string;
      customerId: string;
      plan_code: string;
    };
  };
};

export default function Subscription() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<SubscriptionInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      plan: "",
    },
  });

  // Fetch plan data for edit mode
  const {
    data: planData,
    isLoading: isLoadingPlan,
    error: planError,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: async (): Promise<SubscriptionResponse> => {
      if (!id) throw new Error("Plan ID is required");
      return await Axios.get(`/subscriptions/${id}`);
    },
    enabled: isEditMode,
    retry: 1,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return await Axios.get("/customers");
    },
  });

  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      return await Axios.get("/plans");
    },
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: SubscriptionInputs) => {
      if (isEditMode) {
        return await Axios.put(`/subscriptions/${id}`, data);
      }
      return await Axios.post("/subscriptions/initialize", {
        ...data,
        amount: 200,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", id] });
      message.success(
        `Subscription ${isEditMode ? "updated" : "created"} successfully!`,
      );
      navigate("/subscriptions");
    },
    onError: (error: any) => {
      console.error("Subscription mutation error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} subscription`;
      message.error(errorMessage);
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && planData?.data?.data) {
      const { plan_code, customerId } = planData.data.data;
      setValue("plan", plan_code);
      setValue("email", customerId);
    }
  }, [planData, setValue, isEditMode]);

  const onSubmit = async (data: SubscriptionInputs) => {
    // Basic validation
    if (!data.plan.trim()) {
      message.error("Plan name is required");
      return;
    }

    mutation.mutate(data);
  };

  // Handle loading states
  if (isEditMode && isLoadingPlan) {
    return (
      <div className="subscription-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading subscription details...</p>
        </div>
      </div>
    );
  }
  // Handle error state
  if (isEditMode && planError) {
    return (
      <div className="subscription-container">
        <div className="error-container">
          <h3>Error Loading Plan</h3>
          <p>Unable to load plan details. Please try again.</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/subscriptions/plans")}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>{isEditMode ? "Edit Plan" : "Create New Plan"}</h2>
        <button
          type="button"
          className="btn btn-secondary btn-back"
          onClick={() => navigate("/subscriptions/plans")}
        >
          Back to Subscription
        </button>
      </div>

      {mutation.isPending ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>{isEditMode ? "Updating plan..." : "Creating plan..."}</p>
        </div>
      ) : (
        <form
          name="subscription-form"
          className="subscription-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label htmlFor="customer" className="form-label">
              Customer <span className="required">*</span>
            </label>
            <select
              id="interval"
              className={`form-control ${errors.email ? "error" : ""}`}
              {...register("email", {
                required: "Customer is required",
              })}
            >
              {customerData?.data?.data.map((customer: any) => (
                <option key={customer.id} value={customer.email}>
                  {customer.first_name} {customer.last_name} ({customer.email})
                </option>
              ))}
            </select>
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="interval" className="form-label">
              Subscription Plan <span className="required">*</span>
            </label>
            <select
              id="plan_code"
              className={`form-control ${errors.plan ? "error" : ""}`}
              {...register("plan", {
                required: "Plan code is required",
              })}
            >
              {plansData?.data?.data.map((plan: any) => (
                <option key={plan.id} value={plan.plan_code}>
                  {plan.name} ({plan.plan_code})
                </option>
              ))}
            </select>
            {errors.plan && (
              <span className="error-message">{errors.plan.message}</span>
            )}
          </div>

          <div className="form-group buttons">
            <button
              className="btn btn-secondary mr-2"
              type="button"
              onClick={() => navigate("/subscriptions")}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!isValid || (!isDirty && !isEditMode)}
            >
              {isEditMode ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
