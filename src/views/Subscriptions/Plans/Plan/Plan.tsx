import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Axios from "../../../../networking/adaptor";
import { Spin, message } from "antd";

import "./Plan.scss";

type PlanInputs = {
  name: string;
  interval: "daily" | "weekly" | "monthly" | "yearly";
  amount: number;
};

type PlanResponse = {
  data: {
    data: {
      id: string;
      name: string;
      interval: string;
      amount: number;
    };
  };
};

export default function Plan() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<PlanInputs>({
    mode: "onChange",
    defaultValues: {
      name: "",
      interval: "monthly",
      amount: 0,
    },
  });

  // Fetch plan data for edit mode
  const {
    data: planData,
    isLoading: isLoadingPlan,
    error: planError,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: async (): Promise<PlanResponse> => {
      if (!id) throw new Error("Plan ID is required");
      return await Axios.get(`/plans/${id}`);
    },
    enabled: isEditMode,
    retry: 1,
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: PlanInputs) => {
      if (isEditMode) {
        return await Axios.put(`/plans/${id}`, data);
      }
      return await Axios.post("/plans", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
      message.success(
        `Plan ${isEditMode ? "updated" : "created"} successfully!`,
      );
      navigate("/subscriptions/plans");
    },
    onError: (error: any) => {
      console.error("Plan mutation error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} plan`;
      message.error(errorMessage);
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && planData?.data?.data) {
      const { name, interval, amount } = planData.data.data;
      setValue("name", name);
      setValue("interval", interval as PlanInputs["interval"]);
      setValue("amount", Number(amount));
    }
  }, [planData, setValue, isEditMode]);

  const onSubmit = async (data: PlanInputs) => {
    // Basic validation
    if (!data.name.trim()) {
      message.error("Plan name is required");
      return;
    }
    if (data.amount <= 0) {
      message.error("Plan amount must be greater than 0");
      return;
    }

    mutation.mutate(data);
  };

  // Handle loading states
  if (isEditMode && isLoadingPlan) {
    return (
      <div className="plan-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading plan details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isEditMode && planError) {
    return (
      <div className="plan-container">
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
    <div className="plan-container">
      <div className="plan-header">
        <h2>{isEditMode ? "Edit Plan" : "Create New Plan"}</h2>
        <button
          type="button"
          className="btn btn-secondary btn-back"
          onClick={() => navigate("/subscriptions/plans")}
        >
          Back to Plans
        </button>
      </div>

      {mutation.isPending ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>{isEditMode ? "Updating plan..." : "Creating plan..."}</p>
        </div>
      ) : (
        <form
          name="plan-form"
          className="plan-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Plan Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter plan name"
              className={`form-control ${errors.name ? "error" : ""}`}
              {...register("name", {
                required: "Plan name is required",
                minLength: {
                  value: 2,
                  message: "Plan name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="interval" className="form-label">
              Billing Interval <span className="required">*</span>
            </label>
            <select
              id="interval"
              className={`form-control ${errors.interval ? "error" : ""}`}
              {...register("interval", {
                required: "Billing interval is required",
              })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.interval && (
              <span className="error-message">{errors.interval.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className={`form-control ${errors.amount ? "error" : ""}`}
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0",
                },
              })}
            />
            {errors.amount && (
              <span className="error-message">{errors.amount.message}</span>
            )}
          </div>

          <div className="form-group buttons">
            <button
              className="btn btn-secondary mr-2"
              type="button"
              onClick={() => navigate("/subscriptions/plans")}
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
