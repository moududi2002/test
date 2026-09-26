// apps/admin/src/app/(dashboard)/lyrics/page.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  Plus,
  Search,
  Edit,
  Trash,
  Trash2,
  Eye,
  Star,
  Loader2,
  Music2,
} from 'lucide-react';

import { MdArchive,MdDelete} from "react-icons/md";
import { FaBoxArchive, FaArrowUpFromBracket } from "react-icons/fa6";


import { FaYoutube as Youtube } from 'react-icons/fa';
import { toast } from 'sonner';

import type { Lyric } from '@kobi/types';

import { apiClient } from '@/lib/api/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  formatBengaliDateTime,
  toBengaliDigits,
} from '@kobi/utils';

interface ListResponse {
  data: Lyric[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function LyricsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Lyric[]>([]);
  const [meta, setMeta] = useState<ListResponse['meta'] | null>(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get('search') || '',
  );

  const [status, setStatus] = useState(
    searchParams.get('status') || '',
  );

  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );

  // Archive dialog target
  const [deleteTarget, setDeleteTarget] = useState<Lyric | null>(
    null,
  );

  // Permanent delete dialog target
  const [hardDeleteTarget, setHardDeleteTarget] =
    useState<Lyric | null>(null);

  /**
   * Load lyrics
   */
  const load = useCallback(async () => {
    setLoading(true);

    try {
      const qs = new URLSearchParams();

      qs.set('page', String(page));
      qs.set('limit', '20');

      if (search) {
        qs.set('search', search);
      }

      if (status) {
        qs.set('status', status);
      }

      const res = await apiClient.get<ListResponse>(
        `/admin/lyrics?${qs.toString()}`,
      );

      setItems(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      toast.error(err?.message || 'লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  /**
   * Load when filters/page change
   */
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Sync filters with URL
   */
  useEffect(() => {
    const qs = new URLSearchParams();

    if (search) {
      qs.set('search', search);
    }

    if (status) {
      qs.set('status', status);
    }

    if (page > 1) {
      qs.set('page', String(page));
    }

    const str = qs.toString();

    router.replace(
      str ? `/lyrics?${str}` : '/lyrics',
    );
  }, [search, status, page, router]);

  /**
   * Archive lyric
   */
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await apiClient.delete(
        `/admin/lyrics/${deleteTarget._id}`,
      );

      toast.success('লিরিক আর্কাইভ করা হয়েছে');

      setDeleteTarget(null);

      await load();
    } catch (err: any) {
      toast.error(err?.message || 'আর্কাইভ করা ব্যর্থ');
    }
  };

  /**
   * Permanently delete lyric
   */
  const handlePermanentDelete = async () => {
    if (!hardDeleteTarget) return;

    try {
      await apiClient.delete(
        `/admin/lyrics/${hardDeleteTarget._id}/hard`,
      );

      toast.success(
        'লিরিক স্থায়ীভাবে মুছে ফেলা হয়েছে',
      );

      setHardDeleteTarget(null);

      await load();
    } catch (err: any) {
      toast.error(
        err?.message ||
          'স্থায়ীভাবে মুছে ফেলা ব্যর্থ',
      );
    }
  };

  /**
   * Publish / draft toggle
   */
  const togglePublish = async (lyric: Lyric) => {
    const newStatus =
      lyric.status === 'published'
        ? 'draft'
        : 'published';

    try {
      await apiClient.patch(
        `/admin/lyrics/${lyric._id}/status`,
        {
          status: newStatus,
        },
      );

      toast.success('আপডেট হয়েছে');

      await load();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    }
  };

  /**
   * Featured toggle
   */
  const toggleFeatured = async (lyric: Lyric) => {
    try {
      await apiClient.patch(
        `/admin/lyrics/${lyric._id}/featured`,
        {
          featured: !lyric.featured,
        },
      );

      toast.success('আপডেট হয়েছে');

      await load();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    }
  };

  /**
   * Preview lyric
   */
  const preview = async (lyric: Lyric) => {
    try {
      const res = await apiClient.post<{ token: string }>(
        `/admin/lyrics/${lyric._id}/preview-token`,
      );

      window.open(
        `${
          process.env.NEXT_PUBLIC_WEB_URL ||
          'http://localhost:3000'
        }/preview/${res.token}`,
        '_blank',
      );
    } catch (err: any) {
      toast.error(
        err?.message || 'প্রিভিউ ব্যর্থ',
      );
    }
  };

  return (
    <div className="max-w-7xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            লিরিক্স
          </h1>

          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            {meta
              ? `মোট ${toBengaliDigits(meta.total)}টি লিরিক`
              : ' '}
          </p>
        </div>

        <Link href="/lyrics/new">
          <Button>
            <Plus className="w-4 h-4" />
            নতুন লিরিক
          </Button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] p-3 flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-text-muted)]" />

          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="শিরোনাম দিয়ে খুঁজুন…"
            className="pl-9 font-bangla"
          />
        </div>

        <Select
          value={status || 'all'}
          onValueChange={(value) => {
            setStatus(
              value === 'all' ? '' : value,
            );

            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              সব status
            </SelectItem>

            <SelectItem value="draft">
              ড্রাফট
            </SelectItem>

            <SelectItem value="published">
              প্রকাশিত
            </SelectItem>

            <SelectItem value="archived">
              আর্কাইভড
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lyrics List */}
      <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] overflow-hidden">

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-admin-primary)]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">

            <Music2 className="w-10 h-10 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />

            <p className="font-bangla text-[var(--color-admin-text-muted)]">
              কোনো লিরিক নেই
            </p>

            <Link
              href="/lyrics/new"
              className="mt-4 inline-block"
            >
              <Button size="sm">
                <Plus className="w-4 h-4" />
                প্রথম লিরিক লিখুন
              </Button>
            </Link>

          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-admin-border)]">

            {items.map((lyric) => (
              <li
                key={lyric._id}
                className="p-4 flex items-center gap-4 hover:bg-[var(--color-admin-surface-hover)] transition-colors"
              >

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-md bg-[var(--color-admin-bg)] shrink-0 overflow-hidden relative">

                  {lyric.youtubeVideoId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://i.ytimg.com/vi/${lyric.youtubeVideoId}/hqdefault.jpg`}
                      alt={lyric.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-[var(--color-admin-text-subtle)]" />
                    </div>
                  )}

                </div>

                {/* Lyric Info */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2 flex-wrap">

                    <Link
                      href={`/lyrics/${lyric._id}`}
                      className="font-bangla font-medium text-[var(--color-admin-text)] hover:text-[var(--color-admin-primary)] transition-colors truncate"
                    >
                      {lyric.title}
                    </Link>

                    <Badge variant={lyric.status as any}>
                      {lyric.status === 'draft' &&
                        'ড্রাফট'}

                      {lyric.status === 'published' &&
                        'প্রকাশিত'}

                      {lyric.status === 'archived' &&
                        'আর্কাইভড'}
                    </Badge>

                    {lyric.featured && (
                      <Badge variant="accent" className='inline-flex items-center gap-1.5'>
                        <Star className="w-3 h-3  fill-current" />
                        Featured
                      </Badge>
                    )}

                    {lyric.youtubeVideoId && (
                      <Badge variant="destructive" className='flex items-center gap-1.5'>
                        <Youtube className="w-3 h-3 " />
                        ভিডিও
                      </Badge>
                    )}

                  </div>

                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1 font-bangla">
                    /{lyric.slug} · আপডেট:{' '}
                    {formatBengaliDateTime(
                      lyric.updatedAt,
                    )}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">

                  {/* Preview */}
                  <ActionBtn
                    onClick={() => preview(lyric)}
                    title="প্রিভিউ"
                    icon={Eye}
                  />

                  {/* Featured */}
                  <ActionBtn
                    onClick={() =>
                      toggleFeatured(lyric)
                    }
                    title="ফিচার হিসেবে যুক্ত করুন"
                    icon={Star}
                    active={lyric.featured}
                  />

                  {/* Publish */}
                  <ActionBtn
                    onClick={() =>
                      togglePublish(lyric)
                    }
                    title="পাবলিশ করুন"
                    icon={FaArrowUpFromBracket}
                  />

                  {/* Edit */}
                  <Link
                    href={`/lyrics/${lyric._id}`}
                  >
                    <ActionBtn
                      onClick={() => {}}
                      title="সম্পাদনা"
                      icon={Edit}
                    />
                  </Link>

                  {/* Archive */}
                  <ActionBtn
                    onClick={() =>
                      setDeleteTarget(lyric)
                    }
                    title="আর্কাইভ"
                    icon={FaBoxArchive}
                    destructive
                  />

                  {/* Permanent Delete */}
                  <ActionBtn
                    onClick={() =>
                      setHardDeleteTarget(lyric)
                    }
                    title="স্থায়ীভাবে মুছুন"
                    icon={MdDelete}
                    iconClassName="w-5 h-5"
                    destructive
                  />

                </div>
              </li>
            ))}

          </ul>
        )}

      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">

          <p className="text-sm text-[var(--color-admin-text-muted)] font-bangla">
            পৃষ্ঠা {toBengaliDigits(meta.page)} /{' '}
            {toBengaliDigits(meta.totalPages)}
          </p>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
            >
              আগের
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                meta.page >= meta.totalPages
              }
              onClick={() =>
                setPage((p) => p + 1)
              }
            >
              পরের
            </Button>

          </div>
        </div>
      )}

      {/* =========================
          ARCHIVE CONFIRMATION
          ========================= */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>
              লিরিক আর্কাইভ করবেন?
            </AlertDialogTitle>

            <AlertDialogDescription>
              "{deleteTarget?.title}" আর্কাইভড হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              বাতিল
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
            >
              আর্কাইভ
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

      {/* =========================
          PERMANENT DELETE CONFIRMATION
          ========================= */}
      <AlertDialog
        open={!!hardDeleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setHardDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent
          className="
            max-w-lg
            border-[#8b5e3c]
            bg-[#18110d]
            text-[#f5e6d3]
          "
        >

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6b3f1f]">
              <Trash className="h-8 w-8 text-[#f5d0a9]" />
            </div>
          </div>

          <AlertDialogHeader>

            <AlertDialogTitle className="text-center text-3xl font-bold">
              স্থায়ীভাবে মুছবেন?
            </AlertDialogTitle>
            <br></br>

            <AlertDialogDescription className="text-center text-base text-[#d8c0a8]">
              <span className="font-semibold text-[#cf1565]">
                {hardDeleteTarget?.title}
              </span>

              <br></br>
              <br />

              এই লিরিক স্থায়ীভাবে মুছে যাবে।

              <br />

              এই কাজটি আর ফিরিয়ে আনা যাবে না।
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex-row gap-3">

            <AlertDialogCancel
              className="
                border-[#8b5e3c]
                bg-transparent
                text-[#f5e6d3]
                hover:bg-[#2a1b14]
                hover:text-white
              "
            >
              বাতিল
            </AlertDialogCancel>

            <AlertDialogAction
              className="
                bg-[#b86a2d]
                text-white
                hover:bg-[#c97938]
              "
              onClick={handlePermanentDelete}
            >
              <Trash className="mr-2 h-4 w-4" />

              স্থায়ীভাবে মুছুন
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

/**
 * Action Button
 */
function ActionBtn({
  onClick,
  title,
  icon: Icon,
  active,
  destructive,
  iconClassName = "w-4 h-4",
}: {
  onClick: () => void;
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  active?: boolean;
  destructive?: boolean;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
        active
          ? 'bg-[var(--color-admin-accent)]/15 text-[var(--color-admin-accent)]'
          : destructive
            ? 'text-[var(--color-admin-text-muted)] hover:bg-red-50 hover:text-red-600'
            : 'text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)]'
      }`}
    >
      <Icon className={iconClassName} />
    </button>
  );
}
