import { Memo, CheckboxItem } from '@/types/memo';
import { cn } from '@/lib/utils';
import {
    Pin,
    MoreVertical,
    Check,
    X,
    StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MEMO_COLORS = [
    { name: 'default', bg: 'bg-white dark:bg-zinc-900', border: 'border-gray-200 dark:border-zinc-700' },
    { name: 'red', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900' },
    { name: 'orange', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900' },
    { name: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-900' },
    { name: 'green', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900' },
    { name: 'blue', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900' },
    { name: 'purple', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900' },
];

interface MemoCardProps {
    memo: Memo;
    isEditing: boolean;
    editTitle: string;
    editContent: string;
    onEditTitleChange: (value: string) => void;
    onEditContentChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onEditStart: (memo: Memo) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    onToggleCheckbox: (memoId: string, itemId: string) => void;
}

export function MemoCard({
    memo,
    isEditing,
    editTitle,
    editContent,
    onEditTitleChange,
    onEditContentChange,
    onSave,
    onCancel,
    onEditStart,
    onDelete,
    onTogglePin,
    onToggleCheckbox
}: MemoCardProps) {
    const colorScheme = MEMO_COLORS[0]; // Default color for now

    return (
        <div
            className={cn(
                "group rounded-xl border transition-all duration-200 hover:shadow-md",
                colorScheme.bg,
                colorScheme.border
            )}
        >
            {isEditing ? (
                // Edit Mode
                <div className="p-4 space-y-3">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => onEditTitleChange(e.target.value)}
                        placeholder="タイトル"
                        className="w-full px-0 py-1 bg-transparent border-0 text-base font-medium focus:outline-none placeholder:text-muted-foreground"
                        autoFocus
                    />
                    <textarea
                        value={editContent}
                        onChange={(e) => onEditContentChange(e.target.value)}
                        placeholder="メモを入力..."
                        rows={4}
                        className="w-full px-0 py-1 bg-transparent border-0 text-sm focus:outline-none resize-none placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2 justify-end pt-2">
                        <Button size="sm" variant="ghost" onClick={onCancel}>
                            キャンセル
                        </Button>
                        <Button size="sm" onClick={onSave}>
                            完了
                        </Button>
                    </div>
                </div>
            ) : (
                // View Mode
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-base flex-1 break-words">
                            {memo.title}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onTogglePin(memo.id)}
                                className={cn(
                                    "p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                    memo.isPinned && "opacity-100"
                                )}
                                title={memo.isPinned ? "ピン解除" : "ピン留め"}
                            >
                                <Pin className={cn("w-4 h-4", memo.isPinned && "fill-current")} />
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEditStart(memo)}>
                                        編集
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(memo.id)}
                                        className="text-red-600"
                                    >
                                        削除
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content */}
                    {memo.content && (
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words line-clamp-10 mb-3">
                            {memo.content}
                        </p>
                    )}

                    {/* Checkbox Items */}
                    {memo.checkboxItems && memo.checkboxItems.length > 0 && (
                        <div className="space-y-1.5">
                            {memo.checkboxItems.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex items-start gap-2 cursor-pointer group/item"
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => onToggleCheckbox(memo.id, item.id)}
                                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span
                                        className={cn(
                                            "text-sm flex-1 break-words",
                                            item.checked && "line-through text-muted-foreground"
                                        )}
                                    >
                                        {item.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {memo.tags && memo.tags.length > 0 && (
                        <div className="flex gap-1 mt-3 flex-wrap">
                            {memo.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-foreground/60"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
