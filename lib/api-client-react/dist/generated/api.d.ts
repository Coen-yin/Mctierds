import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { CreatePlayerBody, GetLeaderboardParams, GetTierDistributionParams, HealthStatus, LeaderboardEntry, ListPlayersParams, Player, StatsSummary, TierDistributionEntry } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all players
 */
export declare const getListPlayersUrl: (params?: ListPlayersParams) => string;
export declare const listPlayers: (params?: ListPlayersParams, options?: RequestInit) => Promise<Player[]>;
export declare const getListPlayersQueryKey: (params?: ListPlayersParams) => readonly ["/api/players", ...ListPlayersParams[]];
export declare const getListPlayersQueryOptions: <TData = Awaited<ReturnType<typeof listPlayers>>, TError = ErrorType<unknown>>(params?: ListPlayersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPlayers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPlayers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPlayersQueryResult = NonNullable<Awaited<ReturnType<typeof listPlayers>>>;
export type ListPlayersQueryError = ErrorType<unknown>;
/**
 * @summary List all players
 */
export declare function useListPlayers<TData = Awaited<ReturnType<typeof listPlayers>>, TError = ErrorType<unknown>>(params?: ListPlayersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPlayers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a player
 */
export declare const getCreatePlayerUrl: () => string;
export declare const createPlayer: (createPlayerBody: CreatePlayerBody, options?: RequestInit) => Promise<Player>;
export declare const getCreatePlayerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlayer>>, TError, {
        data: BodyType<CreatePlayerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPlayer>>, TError, {
    data: BodyType<CreatePlayerBody>;
}, TContext>;
export type CreatePlayerMutationResult = NonNullable<Awaited<ReturnType<typeof createPlayer>>>;
export type CreatePlayerMutationBody = BodyType<CreatePlayerBody>;
export type CreatePlayerMutationError = ErrorType<unknown>;
/**
 * @summary Create a player
 */
export declare const useCreatePlayer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlayer>>, TError, {
        data: BodyType<CreatePlayerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPlayer>>, TError, {
    data: BodyType<CreatePlayerBody>;
}, TContext>;
/**
 * @summary Get player by ID
 */
export declare const getGetPlayerUrl: (id: number) => string;
export declare const getPlayer: (id: number, options?: RequestInit) => Promise<Player>;
export declare const getGetPlayerQueryKey: (id: number) => readonly [`/api/players/${number}`];
export declare const getGetPlayerQueryOptions: <TData = Awaited<ReturnType<typeof getPlayer>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlayer>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlayerQueryResult = NonNullable<Awaited<ReturnType<typeof getPlayer>>>;
export type GetPlayerQueryError = ErrorType<void>;
/**
 * @summary Get player by ID
 */
export declare function useGetPlayer<TData = Awaited<ReturnType<typeof getPlayer>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a player
 */
export declare const getUpdatePlayerUrl: (id: number) => string;
export declare const updatePlayer: (id: number, createPlayerBody: CreatePlayerBody, options?: RequestInit) => Promise<Player>;
export declare const getUpdatePlayerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlayer>>, TError, {
        id: number;
        data: BodyType<CreatePlayerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePlayer>>, TError, {
    id: number;
    data: BodyType<CreatePlayerBody>;
}, TContext>;
export type UpdatePlayerMutationResult = NonNullable<Awaited<ReturnType<typeof updatePlayer>>>;
export type UpdatePlayerMutationBody = BodyType<CreatePlayerBody>;
export type UpdatePlayerMutationError = ErrorType<unknown>;
/**
 * @summary Update a player
 */
export declare const useUpdatePlayer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlayer>>, TError, {
        id: number;
        data: BodyType<CreatePlayerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePlayer>>, TError, {
    id: number;
    data: BodyType<CreatePlayerBody>;
}, TContext>;
/**
 * @summary Delete a player
 */
export declare const getDeletePlayerUrl: (id: number) => string;
export declare const deletePlayer: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeletePlayerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlayer>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePlayer>>, TError, {
    id: number;
}, TContext>;
export type DeletePlayerMutationResult = NonNullable<Awaited<ReturnType<typeof deletePlayer>>>;
export type DeletePlayerMutationError = ErrorType<unknown>;
/**
 * @summary Delete a player
 */
export declare const useDeletePlayer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlayer>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePlayer>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get top players leaderboard
 */
export declare const getGetLeaderboardUrl: (params?: GetLeaderboardParams) => string;
export declare const getLeaderboard: (params?: GetLeaderboardParams, options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetLeaderboardQueryKey: (params?: GetLeaderboardParams) => readonly ["/api/leaderboard", ...GetLeaderboardParams[]];
export declare const getGetLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>;
export type GetLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get top players leaderboard
 */
export declare function useGetLeaderboard<TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get site stats summary
 */
export declare const getGetStatsSummaryUrl: () => string;
export declare const getStatsSummary: (options?: RequestInit) => Promise<StatsSummary>;
export declare const getGetStatsSummaryQueryKey: () => readonly ["/api/stats/summary"];
export declare const getGetStatsSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsSummary>>>;
export type GetStatsSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get site stats summary
 */
export declare function useGetStatsSummary<TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get player count by tier
 */
export declare const getGetTierDistributionUrl: (params?: GetTierDistributionParams) => string;
export declare const getTierDistribution: (params?: GetTierDistributionParams, options?: RequestInit) => Promise<TierDistributionEntry[]>;
export declare const getGetTierDistributionQueryKey: (params?: GetTierDistributionParams) => readonly ["/api/stats/tier-distribution", ...GetTierDistributionParams[]];
export declare const getGetTierDistributionQueryOptions: <TData = Awaited<ReturnType<typeof getTierDistribution>>, TError = ErrorType<unknown>>(params?: GetTierDistributionParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTierDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTierDistribution>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTierDistributionQueryResult = NonNullable<Awaited<ReturnType<typeof getTierDistribution>>>;
export type GetTierDistributionQueryError = ErrorType<unknown>;
/**
 * @summary Get player count by tier
 */
export declare function useGetTierDistribution<TData = Awaited<ReturnType<typeof getTierDistribution>>, TError = ErrorType<unknown>>(params?: GetTierDistributionParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTierDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map