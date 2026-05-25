"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ApiVariant } from "@/lib/api";
import { Product } from "@/types";
import AddToCartButton from "@/components/ui/AddToCartButton";
import WishlistToggle from "@/components/ui/WishlistToggle";
import { useLang } from "@/lib/lang";
import { useCart } from "@/lib/cart";

interface Props {
  product:   Product;
  variants?: ApiVariant[];
}

function sameOption(a?: string | null, b?: string | null) {
  return (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();
}

function variantMatchesSelection(
  variant: ApiVariant,
  selectedSize: string | null,
  selectedColor: string | null
) {
  const variantSize = String(variant.size || "").trim();
  const variantColor = String(variant.color || "").trim();

  if (selectedSize && variantSize && !sameOption(variantSize, selectedSize)) return false;
  if (selectedColor && variantColor && !sameOption(variantColor, selectedColor)) return false;
  return true;
}

export default function ProductPurchase({ product, variants }: Props) {
  const { t, lang } = useLang();
  const router = useRouter();
  const { items, addItem } = useCart();
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const colors = product.colors?.filter(Boolean) ?? [];
  const sizes  = product.sizes?.filter(Boolean) ?? [];

  const needsColor = colors.length > 1;
  const needsSize  = sizes.length > 1;
  const hasOptions = colors.length > 0 || sizes.length > 0;

  useEffect(() => {
    if (colors.length === 1) setSelectedColor(colors[0]);
    else setSelectedColor(null);
    if (sizes.length === 1) setSelectedSize(sizes[0]);
    else setSelectedSize(null);
  }, [product.id, colors.join(","), sizes.join(",")]);

  const selectedVariant = useMemo(
    () =>
      variants?.find((v) => variantMatchesSelection(v, selectedSize, selectedColor)),
    [variants, selectedSize, selectedColor]
  );

  const variantOutOfStock = selectedVariant
    ? selectedVariant.stock_quantity === 0
    : false;

  const selectionComplete =
    !hasOptions ||
    ((!needsColor || selectedColor) &&
      (!needsSize || selectedSize) &&
      (!variants?.length || !!selectedVariant));

  const selectionIncomplete = hasOptions && !selectionComplete;

  const availableStock = selectedVariant?.stock_quantity ?? product.remainingStock ??
    (product.stockStatus === "out_of_stock" ? 0 : undefined);

  useEffect(() => {
    if (availableStock !== undefined) {
      setQuantity((current) => Math.max(1, Math.min(current, availableStock)));
    }
  }, [availableStock]);

  const existingCartItem = items.find(
    (item) => item.productId === product.id && item.variantId === selectedVariant?.variant_id
  );
  const existingQuantity = existingCartItem?.quantity ?? 0;
  const maxAddable = availableStock !== undefined ? Math.max(0, availableStock - existingQuantity) : undefined;

  const actualOutOfStock =
    product.stockStatus === "out_of_stock" ||
    variantOutOfStock ||
    (maxAddable !== undefined && maxAddable <= 0);

  const price =
    selectedVariant && selectedVariant.price > 0
      ? selectedVariant.price
      : product.price;

  const blockReason = !selectionComplete
    ? needsColor && !selectedColor
      ? t("selectColor")
      : needsSize && !selectedSize
        ? t("selectSize")
        : t("selectVariant")
    : undefined;

  const stockNotice = (() => {
    const stockCount = selectedVariant?.stock_quantity ?? product.remainingStock;
    if (stockCount === undefined || stockCount > 5 || stockCount <= 0) return "";
    if (stockCount === 1) return t("lastPiece");
    return t("limitedQuantityAvailable");
  })();

  useEffect(() => {
    const image = selectedVariant?.image?.trim() || null;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("productVariantImageChange", { detail: { image } })
      );
    }
  }, [selectedVariant?.variant_id, selectedVariant?.image]);

  const handleAddToCart = () => {
    if (selectionIncomplete) {
      alert(blockReason || t("selectVariant"));
      return;
    }
    if (actualOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.variant_id,
      name: product.name,
      image: product.image,
      price,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      slug: product.slug,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (selectionIncomplete) {
      alert(blockReason || t("selectVariant"));
      return;
    }
    if (actualOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.variant_id,
      name: product.name,
      image: product.image,
      price,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      slug: product.slug,
      quantity,
    });
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-5">
      {hasOptions && (
        <div className="flex flex-col gap-4">
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                {t("color")}
                {needsColor && <span className="text-red-500 mr-1">*</span>}
                {selectedColor && (
                  <span className="font-normal text-gray-500 mr-2">— {selectedColor}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setSelectedColor(colors.length === 1 ? color : selectedColor === color ? null : color)
                    }
                    className={`px-4 py-2 border-2 rounded-full text-sm transition-all duration-200 ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                {t("size")}
                {needsSize && <span className="text-red-500 mr-1">*</span>}
                {selectedSize && (
                  <span className="font-normal text-gray-500 mr-2">— {selectedSize}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSize(sizes.length === 1 ? size : selectedSize === size ? null : size)
                    }
                    className={`px-4 py-2 border-2 rounded-full text-sm transition-all duration-200 ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">{t("quantity")}</span>
            <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="px-4 py-2 text-gray-700 disabled:text-gray-300"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  const next = quantity + 1;
                  if (availableStock === undefined || next <= availableStock) {
                    setQuantity(next);
                  }
                }}
                disabled={availableStock !== undefined && quantity >= availableStock}
                className="px-4 py-2 text-gray-700 disabled:text-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {stockNotice && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              {stockNotice}
            </p>
          )}

          {blockReason && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              {blockReason}
            </p>
          )}

          {variantOutOfStock && selectionComplete && (
            <p className="text-sm text-red-500 font-medium">{t("outOfStock")}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
          <AddToCartButton
            productId={product.id}
            name={product.name}
            image={product.image}
            price={price}
            slug={product.slug}
            variantId={selectedVariant?.variant_id}
            size={selectedSize || undefined}
            color={selectedColor || undefined}
            quantity={quantity}
            outOfStock={actualOutOfStock}
            disabled={actualOutOfStock}
            disabledLabel={actualOutOfStock ? t("outOfStock") : undefined}
            onClick={handleAddToCart}
          />

          <WishlistToggle productId={product.id} iconOnly />
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={actualOutOfStock}
          className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 text-sm"
        >
          {t("buyNow")}
        </button>
      </div>
    </div>
  );
}
