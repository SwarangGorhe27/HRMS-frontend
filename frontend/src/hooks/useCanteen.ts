import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@api/client';

// ─── Types ───────────────────────────────────────

export interface CanteenLocation {
  id: string;
  name: string;
  building: string;
  floor: string;
  is_active: boolean;
  operating_hours_start: string;
  operating_hours_end: string;
  pre_order_cutoff_minutes: number;
  max_orders_per_slot: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  display_order: number;
  icon: string;
  is_active: boolean;
  canteen: string;
}

export interface MenuItem {
  id: string;
  category: string;
  category_name: string;
  canteen: string;
  name: string;
  description: string;
  item_type: 'VEG' | 'NON_VEG' | 'EGG' | 'VEGAN';
  price: number;
  employee_price: number | null;
  effective_price: number;
  company_subsidy_per_item: number;
  is_available: boolean;
  image: string | null;
  calories: number | null;
  preparation_time_minutes: number;
  is_featured: boolean;
  daily_quota: number | null;
}

export interface CanteenBreakSlot {
  id: string;
  canteen: string;
  name: string;
  slot_start: string;
  slot_end: string;
  max_orders: number | null;
  is_active: boolean;
}

export interface CanteenOrderItem {
  id: string;
  menu_item: string;
  item_name: string;
  item_type: string;
  quantity: number;
  unit_price: number;
  unit_subsidy: number;
  special_instructions: string;
  line_total: number;
}

export interface CanteenOrder {
  id: string;
  order_number: string;
  employee: string;
  employee_name: string;
  employee_code: string;
  canteen: string;
  canteen_name: string;
  break_slot: string | null;
  break_slot_name: string | null;
  order_date: string;
  status: 'DRAFT' | 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COLLECTED' | 'CANCELLED' | 'REFUNDED';
  payment_mode: string;
  subtotal: number;
  discount_amount: number;
  company_subsidy: number;
  employee_payable: number;
  placed_at: string | null;
  pickup_token: string;
  special_instructions: string;
  items: CanteenOrderItem[];
  created_at: string;
}

export interface CanteenWallet {
  id: string;
  employee: string;
  balance: number;
  last_recharged_at: string | null;
  is_active: boolean;
}

export interface WalletTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  notes: string;
  created_at: string;
}

export interface PlaceOrderPayload {
  canteen: string;
  break_slot?: string | null;
  payment_mode?: string;
  special_instructions?: string;
  items: { menu_item: string; quantity: number; special_instructions?: string }[];
}

// ─── Extract helpers ─────────────────────────────

function extract<T>(res: unknown): T[] {
  const d = res as Record<string, unknown>;
  return (d?.data as Record<string, unknown>)?.results as T[]
    ?? (d?.data as Record<string, unknown>)?.data as T[]
    ?? d?.data as T[]
    ?? d?.results as T[]
    ?? (Array.isArray(d) ? d : []) as T[];
}

function extractOne<T>(res: unknown): T {
  const d = res as Record<string, unknown>;
  return ((d?.data as Record<string, unknown>)?.data ?? d?.data ?? d) as T;
}

// ─── Hooks ───────────────────────────────────────

export function useCanteenLocations() {
  return useQuery({
    queryKey: ['canteen', 'locations'],
    queryFn: async () => {
      const res = await api.get('/canteen/locations/');
      return extract<CanteenLocation>(res);
    },
  });
}

export function useMenuCategories(canteenId?: string) {
  return useQuery({
    queryKey: ['canteen', 'categories', canteenId],
    queryFn: async () => {
      const params = canteenId ? { canteen: canteenId } : {};
      const res = await api.get('/canteen/categories/', { params });
      return extract<MenuCategory>(res);
    },
    enabled: !!canteenId,
  });
}

export function useMenuItems(canteenId?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['canteen', 'items', canteenId, categoryId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (canteenId) params.canteen = canteenId;
      if (categoryId) params.category = categoryId;
      const res = await api.get('/canteen/items/', { params });
      return extract<MenuItem>(res);
    },
    enabled: !!canteenId,
  });
}

export function useBreakSlots(canteenId?: string) {
  return useQuery({
    queryKey: ['canteen', 'break-slots', canteenId],
    queryFn: async () => {
      const params = canteenId ? { canteen: canteenId } : {};
      const res = await api.get('/canteen/break-slots/', { params });
      return extract<CanteenBreakSlot>(res);
    },
    enabled: !!canteenId,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['canteen', 'my-orders'],
    queryFn: async () => {
      const res = await api.get('/canteen/orders/');
      return extract<CanteenOrder>(res);
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['canteen', 'all-orders'],
    queryFn: async () => {
      const res = await api.get('/canteen/orders/', { params: { all: 'true' } });
      return extract<CanteenOrder>(res);
    },
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const res = await api.post('/canteen/orders/place/', payload);
      return extractOne<CanteenOrder>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'my-orders'] });
      qc.invalidateQueries({ queryKey: ['canteen', 'wallet'] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const res = await api.post(`/canteen/orders/${orderId}/cancel/`, { reason });
      return extractOne<CanteenOrder>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.post(`/canteen/orders/${orderId}/update_status/`, { status });
      return extractOne<CanteenOrder>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen'] });
    },
  });
}

export function useMyWallet() {
  return useQuery({
    queryKey: ['canteen', 'wallet', 'me'],
    queryFn: async () => {
      const res = await api.get('/canteen/wallet/me/');
      return extractOne<CanteenWallet>(res);
    },
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ['canteen', 'wallet', 'transactions'],
    queryFn: async () => {
      const res = await api.get('/canteen/wallet/transactions/');
      return extract<WalletTransaction>(res);
    },
  });
}

export function useRechargeWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      method,
      upi_ref,
    }: {
      amount: number;
      method: 'UPI' | 'SALARY';
      upi_ref?: string;
    }) => {
      const res = await api.post('/canteen/wallet/recharge/', { amount, method, upi_ref });
      return extractOne<CanteenWallet>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'wallet'] });
    },
  });
}

export function useKitchenDashboard(canteenId?: string) {
  return useQuery({
    queryKey: ['canteen', 'kitchen', canteenId],
    queryFn: async () => {
      const params = canteenId ? { canteen: canteenId } : {};
      const res = await api.get('/canteen/kitchen/', { params });
      return extractOne<Record<string, { label: string; count: number; orders: CanteenOrder[] }>>(res);
    },
    refetchInterval: 15000, // auto-refresh every 15s for kitchen view
  });
}

// ─── Admin: Menu Management ────────────────────

export interface MenuItemPayload {
  canteen: string;
  category: string;
  name: string;
  description?: string;
  item_type: 'VEG' | 'NON_VEG' | 'EGG' | 'VEGAN';
  price: number;
  employee_price?: number | null;
  company_subsidy_per_item?: number;
  is_available?: boolean;
  calories?: number | null;
  preparation_time_minutes?: number;
  is_featured?: boolean;
  daily_quota?: number | null;
}

export interface MenuCategoryPayload {
  canteen: string;
  name: string;
  display_order?: number;
  icon?: string;
  is_active?: boolean;
}

export function useAllMenuItems(canteenId?: string) {
  return useQuery({
    queryKey: ['canteen', 'admin-items', canteenId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (canteenId) params.canteen = canteenId;
      const res = await api.get('/canteen/items/', { params });
      return extract<MenuItem>(res);
    },
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MenuItemPayload) => {
      const res = await api.post('/canteen/items/', payload);
      return extractOne<MenuItem>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'items'] });
      qc.invalidateQueries({ queryKey: ['canteen', 'admin-items'] });
    },
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<MenuItemPayload> & { id: string }) => {
      const res = await api.patch(`/canteen/items/${id}/`, payload);
      return extractOne<MenuItem>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'items'] });
      qc.invalidateQueries({ queryKey: ['canteen', 'admin-items'] });
    },
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/canteen/items/${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'items'] });
      qc.invalidateQueries({ queryKey: ['canteen', 'admin-items'] });
    },
  });
}

export function useCreateMenuCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MenuCategoryPayload) => {
      const res = await api.post('/canteen/categories/', payload);
      return extractOne<MenuCategory>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'categories'] });
    },
  });
}

export function useDeleteMenuCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/canteen/categories/${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteen', 'categories'] });
    },
  });
}

