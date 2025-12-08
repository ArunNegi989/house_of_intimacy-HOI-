// src/pages/management/products/edit.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Tag,
  TagLabel,
  TagCloseButton,
  Heading,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  Divider,
  Text,
  useColorModeValue,
  Badge,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ChromePicker } from "react-color"; // 🎨 SAME AS ADD FORM

// ✅ SAME SWATCHES AS ADD FORM
const predefinedSwatches = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#FFFFFF" },
  { label: "Nude", value: "#F5D0C5" },
  { label: "Red", value: "#EF4444" },
  { label: "Pink", value: "#EC4899" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#22C55E" },
  { label: "Purple", value: "#A855F7" },
  { label: "Yellow", value: "#FACC15" },
];

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";
// For existing images coming from DB
const apiRoot = baseUrl.replace(/\/v1$/, "");

const EditProducts = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { id } = useParams(); // <-- /admin/products/:id/edit
  const navigate = useNavigate();
  const toast = useToast();

  const [sizes, setSizes] = useState([
    { label: "XS", stock: 0, selected: false },
    { label: "S", stock: 0, selected: false },
    { label: "M", stock: 0, selected: false },
    { label: "L", stock: 0, selected: false },
    { label: "XL", stock: 0, selected: false },
    { label: "XXL", stock: 0, selected: false },
    { label: "3XL", stock: 0, selected: false },
  ]);

  const [imagePreview, setImagePreview] = useState(null);

  // 🎨 color picker states
  const [currentColor, setCurrentColor] = useState("#000000");
  const [selectedColors, setSelectedColors] = useState([]);

  // ⭐ Product Features (multiple points)
  const [featurePoints, setFeaturePoints] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  // ⭐ Shipping & Returns points
  const [shippingPoints, setShippingPoints] = useState([]);
  const [shippingInput, setShippingInput] = useState("");

  const [loadingProduct, setLoadingProduct] = useState(true);

  const cardBg = useColorModeValue("white", "gray.900");
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Auto price calculation
  const mrp = Number(watch("mrp") || 0);
  const discount = Number(watch("discount") || 0);
  const salePrice = Math.max(
    0,
    Math.round(mrp - (mrp * discount) / 100) || 0
  );

  // Live preview data
  const nameWatch = watch("name") || "Product name";
  const brandWatch = watch("brand") || "Brand";
  const categoryWatch = watch("category") || "Category";
  const colorsWatch = watch("colors") || selectedColors.join(", ");
  const tagsWatch = watch("tags") || "";
  const isFeaturedWatch = watch("isFeatured") || false;

  const mainImageRegister = register("mainImage");

  // 👉 same helper as Add form: add color
  const handleAddColor = () => {
    setSelectedColors((prev) => {
      if (!currentColor) return prev;
      if (prev.includes(currentColor)) return prev;
      const updated = [...prev, currentColor];
      setValue("colors", updated.join(","), { shouldValidate: true });
      return updated;
    });
  };

  // 👉 same helper as Add form: remove color
  const handleRemoveColor = (hex) => {
    setSelectedColors((prev) => {
      const updated = prev.filter((c) => c !== hex);
      setValue("colors", updated.join(","), { shouldValidate: true });
      return updated;
    });
  };

  // 👉 Add feature point
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;

    setFeaturePoints((prev) => {
      const updated = [...prev, trimmed];
      setValue("features", updated.join("||"), { shouldValidate: true });
      return updated;
    });
    setFeatureInput("");
  };

  const handleRemoveFeature = (index) => {
    setFeaturePoints((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("features", updated.join("||"), { shouldValidate: true });
      return updated;
    });
  };

  // 👉 Add Shipping & Returns point
  const handleAddShippingPoint = () => {
    const trimmed = shippingInput.trim();
    if (!trimmed) return;

    setShippingPoints((prev) => {
      const updated = [...prev, trimmed];
      setValue("shippingInfo", updated.join("||"), { shouldValidate: true });
      return updated;
    });
    setShippingInput("");
  };

  const handleRemoveShippingPoint = (index) => {
    setShippingPoints((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("shippingInfo", updated.join("||"), { shouldValidate: true });
      return updated;
    });
  };

  // ➜ FETCH PRODUCT BY ID ON MOUNT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const res = await axios.get(`${baseUrl}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const p = res.data;

        // BASIC INFO
        setValue("name", p.name || "");
        setValue("slug", p.slug || "");
        setValue("brand", p.brand || "");
        setValue("gender", p.gender || "");
        setValue("category", p.category || "");
        setValue("subcategory", p.subcategory || "");
        setValue("sku", p.sku || "");
        setValue("taxSlab", p.taxSlab || "");

        // MEDIA
        setValue("sizeGuideUrl", p.sizeGuideUrl || "");
        setValue("videoUrl", p.videoUrl || "");

        // FABRIC / ATTRIBUTES
        setValue("fabric", p.fabric || "");
        setValue("composition", p.composition || "");
        setValue("coverage", p.coverage || "");
        setValue("padding", p.padding || "");
        setValue("underwire", p.underwire || "");
        setValue("strapType", p.strapType || "");
        setValue("closureType", p.closureType || "");
        setValue("pattern", p.pattern || "");
        setValue("occasion", p.occasion || "");
        setValue("careInstructions", p.careInstructions || "");

        // DESCRIPTIONS
        setValue("shortDescription", p.shortDescription || "");
        setValue("description", p.description || "");

        // INVENTORY
        setValue("status", p.status || "active");
        if (typeof p.totalStock === "number") {
          setValue("totalStock", p.totalStock);
        }

        // FEATURED
        setValue("isFeatured", !!p.isFeatured);

        // PRICE
        if (p.price) {
          setValue("mrp", p.price.mrp || 0);
          setValue("discount", p.price.discountPercent || 0);
        }

        // SIZES
        if (Array.isArray(p.sizes) && p.sizes.length > 0) {
          const updatedSizes = sizes.map((s) => {
            const found = p.sizes.find((ps) => ps.label === s.label);
            if (found) {
              return {
                label: s.label,
                stock: found.stock || 0,
                selected: (found.stock || 0) > 0,
              };
            }
            return s;
          });
          setSizes(updatedSizes);
        }

        // TAGS
        if (Array.isArray(p.tags)) {
          setValue("tags", p.tags.join(", "));
        }

        // COLORS (array from DB – hex or names)
        if (Array.isArray(p.colors)) {
          setSelectedColors(p.colors);
          setValue("colors", p.colors.join(","));
        }

        // COLLECTIONS
        if (Array.isArray(p.collections)) {
          setValue("collections", p.collections.join(", "));
        }

        // ⭐ FEATURES
        if (Array.isArray(p.features)) {
          setFeaturePoints(p.features);
          setValue("features", p.features.join("||"));
        }

        // ⭐ SHIPPING & RETURNS
        if (Array.isArray(p.shippingAndReturns)) {
          setShippingPoints(p.shippingAndReturns);
          setValue("shippingInfo", p.shippingAndReturns.join("||"));
        }

        // SEO
        if (p.seo) {
          setValue("metaTitle", p.seo.metaTitle || "");
          setValue("metaDescription", p.seo.metaDescription || "");
          if (Array.isArray(p.seo.keywords)) {
            setValue("seoKeywords", p.seo.keywords.join(", "));
          }
          setValue("seoSchema", p.seo.schemaMarkup || "");
        }

        // IMAGE PREVIEW (existing main image)
        if (p.mainImage) {
          setImagePreview(`${apiRoot}${p.mainImage}`);
        }

        setLoadingProduct(false);
      } catch (err) {
        console.error("Fetch product error:", err);
        toast({
          title: "Error",
          description:
            err?.response?.data?.message ||
            "Failed to load product details for editing.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setLoadingProduct(false);
        navigate("/admin/products");
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 👉 SUBMIT: UPDATE Product via PUT /products/:id
  const onSubmit = async (data) => {
    const selectedSizes = sizes
      .filter((s) => s.selected)
      .map((s) => ({ label: s.label, stock: Number(s.stock || 0) }));

    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const colorsSource =
      data.colors && data.colors.trim().length > 0
        ? data.colors
        : selectedColors.join(",");
    const colorsArray = colorsSource
      ? colorsSource
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const keywordsArray = data.seoKeywords
      ? data.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    const collectionsArray = data.collections
      ? data.collections
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const featuresArray = data.features
      ? data.features
          .split("||")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const shippingArray = data.shippingInfo
      ? data.shippingInfo
          .split("||")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Build FormData
    const formData = new FormData();

    // BASIC INFO
    formData.append("name", data.name || "");
    formData.append("slug", data.slug || "");
    formData.append("brand", data.brand || "");
    formData.append("gender", data.gender || "");
    formData.append("category", data.category || "");
    formData.append("subcategory", data.subcategory || "");
    formData.append("sku", data.sku || "");
    formData.append("taxSlab", data.taxSlab || "");

    // MEDIA
    formData.append("sizeGuideUrl", data.sizeGuideUrl || "");
    formData.append("videoUrl", data.videoUrl || "");

    // FABRIC / ATTRIBUTES
    formData.append("fabric", data.fabric || "");
    formData.append("composition", data.composition || "");
    formData.append("coverage", data.coverage || "");
    formData.append("padding", data.padding || "");
    formData.append("underwire", data.underwire || "");
    formData.append("strapType", data.strapType || "");
    formData.append("closureType", data.closureType || "");
    formData.append("pattern", data.pattern || "");
    formData.append("occasion", data.occasion || "");
    formData.append("careInstructions", data.careInstructions || "");

    // DESCRIPTIONS
    formData.append("shortDescription", data.shortDescription || "");
    formData.append("description", data.description || "");

    // INVENTORY
    formData.append("status", data.status || "active");
    formData.append("totalStock", data.totalStock || "");

    // FEATURED
    formData.append("isFeatured", data.isFeatured ? "true" : "false");

    // OBJECTS / ARRAYS -> JSON
    formData.append(
      "price",
      JSON.stringify({
        mrp,
        discountPercent: discount,
        sale: salePrice,
      })
    );
    formData.append("sizes", JSON.stringify(selectedSizes));
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("colors", JSON.stringify(colorsArray));
    formData.append("collections", JSON.stringify(collectionsArray));
    formData.append("features", JSON.stringify(featuresArray));
    formData.append("shippingAndReturns", JSON.stringify(shippingArray));

    formData.append(
      "seo",
      JSON.stringify({
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: keywordsArray,
        schemaMarkup: data.seoSchema || "",
      })
    );

    // FILES (optional on edit)
    if (data.mainImage && data.mainImage[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    if (data.galleryImages && data.galleryImages.length > 0) {
      Array.from(data.galleryImages).forEach((file) => {
        formData.append("galleryImages", file);
      });
    }

    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const res = await axios.put(`${baseUrl}/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product updated:", res.data);

      toast({
        title: "Product Updated",
        description: "Product details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      navigate("/admin/products");
    } catch (err) {
      console.error("Update product error:", err);

      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Something went wrong while updating product",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // LOADING STATE WHILE FETCHING PRODUCT
  if (loadingProduct) {
    return (
      <Box bg={pageBg} pt={{ base: "95px", md: "85px" }} minH="100vh">
        <Box maxW="1200px" mx="auto">
          <Flex justify="center" align="center" minH="60vh">
            <Spinner size="lg" />
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={pageBg} pt={{ base: "145px", md: "115px" }} minH="100vh">
      <Box maxW="1200px" mx="auto">
        {/* Page Header */}
        <Flex justify="flex-end" mb={3}>
          <Button
            colorScheme="purple"
            onClick={() => navigate(-1)}
            rounded="full"
            px={6}
            py={2}
            fontWeight="600"
          >
            ← Back to Products
          </Button>
        </Flex>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={2}
          mb={6}
        >
          <Box>
            <Heading size="lg" mb={1}>
              Update Product
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Existing product details edit karo aur save karo.
            </Text>
          </Box>

          <Badge
            colorScheme="purple"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
          >
            HOI • Innerwear / Swimwear
          </Badge>
        </Flex>

        <Flex gap={6} direction={{ base: "column", lg: "row" }}>
          {/* LEFT: MAIN FORM */}
          <Box
            flex="3"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              {/* BASIC INFO */}
              <Heading size="md" mb={3}>
                Basic Information
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Product ka naam, category, brand etc.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl isRequired isInvalid={errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    placeholder="Jockey Cotton Bikini Brief"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <Text fontSize="xs" color="red.400" mt={1}>
                      {errors.name.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Slug (URL)</FormLabel>
                  <Input
                    placeholder="jockey-cotton-bikini-brief-black"
                    {...register("slug")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Select {...register("brand")} placeholder="Select brand">
                    <option value="Jockey">Jockey</option>
                    <option value="Nike">Nike</option>
                    <option value="Puma">Puma</option>
                    <option value="Clovia">Clovia</option>
                    <option value="Zivame">Zivame</option>
                    <option value="Vamika">Vamika</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Gender / Target</FormLabel>
                  <Select {...register("gender")} placeholder="Select target">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    {...register("category")}
                    placeholder="Select category"
                  >
                    <option>Bra</option>
                    <option>Panty</option>
                    <option>Brief</option>
                    <option>Boxer</option>
                    <option>Nightwear</option>
                    <option>Swimwear</option>
                    <option>Shapewear</option>
                    <option>Active</option>
                    <option>Layering</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Sub Category / Style</FormLabel>
                  <Input
                    {...register("subcategory")}
                    placeholder="Example: T-shirt Bra, Bikini, Bralette, Hipster"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>SKU</FormLabel>
                  <Input
                    {...register("sku")}
                    placeholder="JKY-BRA-123-RED-34B"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>HSN / Tax Slab</FormLabel>
                  <Input
                    {...register("taxSlab")}
                    placeholder="Example: 12% GST / HSN code"
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* IMAGES */}
              <Heading size="md" mb={3}>
                Images
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Main image product thumbnail ke liye use hogi, gallery detail
                page ke liye.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Main Image (change if needed)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    {...mainImageRegister}
                    onChange={(e) => {
                      mainImageRegister.onChange(e);
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Gallery Images (multiple)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("galleryImages")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Size Guide Image / URL</FormLabel>
                  <Input
                    {...register("sizeGuideUrl")}
                    placeholder="https://example.com/size-guide-image"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Video URL (optional)</FormLabel>
                  <Input
                    {...register("videoUrl")}
                    placeholder="https://youtube.com/..."
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* COLORS & SIZES */}
              <Heading size="md" mb={3}>
                Colors & Sizes
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Multiple colors & per-size stock set kar sakte ho.
              </Text>

              {/* 🎨 COLOR PICKER + OPTIONS + INPUT (SAME AS ADD FORM) */}
              <FormControl mb={4}>
                <FormLabel>Colors</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Color plate se pick karo, quick colors pe click karo ya manual
                  color type karo. Jo add karoge woh hex/code ke form me save
                  hoga.
                </Text>

                {/* Hidden field – RHF ke liye actual value */}
                <Input
                  type="hidden"
                  {...register("colors")}
                  value={selectedColors.join(",")}
                  readOnly
                />

                <Flex
                  gap={6}
                  align={{ base: "flex-start", md: "flex-start" }}
                  direction={{ base: "column", md: "row" }}
                >
                  {/* LEFT: Color plate / ChromePicker */}
                  <Box>
                    <ChromePicker
                      color={currentColor}
                      onChangeComplete={(color) => {
                        setCurrentColor(color.hex);
                      }}
                    />
                  </Box>

                  {/* RIGHT: current color + input + ready options + selected list */}
                  <Box flex="1">
                    {/* Current color preview + hex */}
                    <Flex align="center" gap={3} mb={3}>
                      <Box
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        border="1px solid"
                        borderColor={borderColor}
                        bg={currentColor}
                      />
                      <Text fontSize="sm">{currentColor}</Text>
                    </Flex>

                    {/* Manual input field */}
                    <FormLabel fontSize="xs" color="gray.500" mb={1}>
                      Type color (hex ya naam) – e.g. #F97316, #000000, red
                    </FormLabel>
                    <Flex gap={2} mb={3}>
                      <Input
                        size="sm"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        placeholder="#F97316 ya red"
                      />
                      <Button
                        size="sm"
                        colorScheme="purple"
                        onClick={handleAddColor}
                      >
                        Add Color
                      </Button>
                    </Flex>

                    {/* Ready-made color options */}
                    <Box mb={3}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Quick colors:
                      </Text>
                      <Flex wrap="wrap" gap={3}>
                        {predefinedSwatches.map((c) => (
                          <Flex
                            key={c.value}
                            direction="column"
                            align="center"
                            gap={1}
                            cursor="pointer"
                            onClick={() => {
                              setCurrentColor(c.value);
                            }}
                          >
                            <Box
                              w="22px"
                              h="22px"
                              borderRadius="full"
                              borderWidth="1px"
                              borderColor="gray.300"
                              bg={c.value}
                            />
                            <Text fontSize="9px" color="gray.600">
                              {c.label}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>

                    {/* Selected colors list */}
                    <Box
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={3}
                    >
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        Selected Colors:
                      </Text>

                      {selectedColors.length === 0 && (
                        <Text fontSize="xs" color="gray.400">
                          Abhi koi color add nahi hua hai.
                        </Text>
                      )}

                      <Flex wrap="wrap" gap={3}>
                        {selectedColors.map((hex) => (
                          <Flex
                            key={hex}
                            align="center"
                            gap={2}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            <Box
                              w="18px"
                              h="18px"
                              borderRadius="full"
                              bg={hex}
                              border="1px solid rgba(0,0,0,0.15)"
                            />
                            <Text fontSize="xs">{hex}</Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleRemoveColor(hex)}
                            >
                              ✕
                            </Button>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              </FormControl>

              {/* Sizes with Stock */}
              <Box>
                <FormLabel fontWeight="600" mb={2}>
                  Available Sizes & Stock
                </FormLabel>

                <Flex gap={4} wrap="wrap">
                  {sizes.map((size, index) => (
                    <Box
                      key={size.label}
                      p={3}
                      border="1px solid"
                      borderColor={borderColor}
                      rounded="md"
                      minW="130px"
                    >
                      <Flex align="center" justify="space-between">
                        <Tag size="sm" variant="subtle" colorScheme="blue">
                          {size.label}
                        </Tag>
                        <Switch
                          size="sm"
                          isChecked={size.selected}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].selected = e.target.checked;
                            setSizes(updated);
                          }}
                        />
                      </Flex>

                      {size.selected && (
                        <Input
                          mt={2}
                          size="sm"
                          placeholder="Stock"
                          type="number"
                          min={0}
                          value={size.stock}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].stock = e.target.value;
                            setSizes(updated);
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Flex>
              </Box>

              <Divider my={6} />

              {/* PRICING & INVENTORY */}
              <Heading size="md" mb={3}>
                Pricing & Inventory
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                MRP, discount set karo. Sale price auto calculate ho jayega.
              </Text>

              <SimpleGrid columns={[1, 3]} gap={4}>
                <FormControl>
                  <FormLabel>MRP (₹)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register("mrp")}
                      placeholder="999"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Discount (%)</FormLabel>
                  <NumberInput min={0} max={90}>
                    <NumberInputField
                      {...register("discount")}
                      placeholder="20"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Sale Price (₹)</FormLabel>
                  <Input value={salePrice} isReadOnly bg="gray.200" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2]} gap={4} mt={4}>
                <FormControl>
                  <FormLabel>Total Stock (optional)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register("totalStock")}
                      placeholder="Auto from sizes or manual"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select {...register("status")} defaultValue="active">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={4} display="flex" alignItems="center" gap={3}>
                <FormLabel mb="0">Featured on Home Page</FormLabel>
                <Switch {...register("isFeatured")} />
              </FormControl>

              <Divider my={6} />

              {/* FABRIC & COMFORT */}
              <Heading size="md" mb={3}>
                Fabric & Comfort Attributes
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Innerwear ke liye yeh fields bahut helpful hoti hain filters ke
                liye.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Fabric</FormLabel>
                  <Select {...register("fabric")} placeholder="Select fabric">
                    <option>Cotton</option>
                    <option>Modal</option>
                    <option>Cotton Blend</option>
                    <option>Polyester</option>
                    <option>Nylon</option>
                    <option>Spandex</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Fabric Composition</FormLabel>
                  <Input
                    {...register("composition")}
                    placeholder="95% Cotton, 5% Elastane"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Coverage</FormLabel>
                  <Select
                    {...register("coverage")}
                    placeholder="Select coverage"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Full</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Padding</FormLabel>
                  <Select
                    {...register("padding")}
                    placeholder="Select padding"
                  >
                    <option>Non-Padded</option>
                    <option>Lightly Padded</option>
                    <option>Heavily Padded</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Underwire</FormLabel>
                  <Select
                    {...register("underwire")}
                    placeholder="Wired / Non-wired"
                  >
                    <option>Wired</option>
                    <option>Non-wired</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Strap Type</FormLabel>
                  <Select
                    {...register("strapType")}
                    placeholder="Select strap type"
                  >
                    <option>Regular</option>
                    <option>Detachable</option>
                    <option>Multiway</option>
                    <option>Transparent</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Closure Type</FormLabel>
                  <Select
                    {...register("closureType")}
                    placeholder="Select closure"
                  >
                    <option>Back Closure</option>
                    <option>Front Closure</option>
                    <option>Slip-on</option>
                    <option>Hook &amp; Eye</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Pattern / Design</FormLabel>
                  <Select
                    {...register("pattern")}
                    placeholder="Select pattern"
                  >
                    <option>Solid</option>
                    <option>Printed</option>
                    <option>Lace</option>
                    <option>Striped</option>
                    <option>Polka Dot</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Occasion / Use</FormLabel>
                  <Select
                    {...register("occasion")}
                    placeholder="Select occasion"
                  >
                    <option>Everyday</option>
                    <option>Sports</option>
                    <option>Bridal</option>
                    <option>Party</option>
                    <option>Sleepwear</option>
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: "1 / -1", md: "1 / -1" }}>
                  <FormLabel>Care Instructions</FormLabel>
                  <Textarea
                    {...register("careInstructions")}
                    placeholder="Machine wash cold, Do not bleach, Line dry in shade."
                    rows={2}
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* DESCRIPTION & TAGS */}
              <Heading size="md" mb={3}>
                Description & Tags
              </Heading>

              <FormControl mb={4}>
                <FormLabel>Short Description</FormLabel>
                <Textarea
                  {...register("shortDescription")}
                  placeholder="2–3 line summary for listing cards."
                  rows={2}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Full Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Detailed product description, features, feel, fit..."
                  rows={5}
                />
              </FormControl>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <Input
                    {...register("tags")}
                    placeholder="bestseller, seamless, wireless, summer"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Collections</FormLabel>
                  <Input
                    {...register("collections")}
                    placeholder="Summer Collection, Bridal Edit"
                  />
                </FormControl>
              </SimpleGrid>

              {/* ⭐ NEW: Product Features & Shipping/Returns (same as add form) */}
              <SimpleGrid columns={[1, 2]} gap={4} mt={4}>
                {/* Product Features */}
                <FormControl>
                  <FormLabel>Product Features (multiple points)</FormLabel>

                  {/* Hidden field for RHF */}
                  <Input
                    type="hidden"
                    {...register("features")}
                    value={featurePoints.join("||")}
                    readOnly
                  />

                  <Flex gap={2} mb={2}>
                    <Input
                      size="sm"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature point (e.g. Soft breathable cotton)"
                    />
                    <Button
                      size="sm"
                      colorScheme="purple"
                      onClick={handleAddFeature}
                    >
                      Add
                    </Button>
                  </Flex>

                  <Flex wrap="wrap" gap={2}>
                    {featurePoints.length === 0 && (
                      <Text fontSize="xs" color="gray.400">
                        Abhi koi feature add nahi hua hai.
                      </Text>
                    )}

                    {featurePoints.map((point, idx) => (
                      <Tag
                        key={idx}
                        borderRadius="full"
                        variant="subtle"
                        colorScheme="pink"
                      >
                        <TagLabel>{point}</TagLabel>
                        <TagCloseButton
                          onClick={() => handleRemoveFeature(idx)}
                        />
                      </Tag>
                    ))}
                  </Flex>
                </FormControl>

                {/* Shipping & Returns */}
                <FormControl>
                  <FormLabel>Shipping & Returns (points)</FormLabel>

                  {/* Hidden field for RHF */}
                  <Input
                    type="hidden"
                    {...register("shippingInfo")}
                    value={shippingPoints.join("||")}
                    readOnly
                  />

                  <Flex gap={2} mb={2}>
                    <Input
                      size="sm"
                      value={shippingInput}
                      onChange={(e) => setShippingInput(e.target.value)}
                      placeholder="e.g. Free shipping above ₹999"
                    />
                    <Button
                      size="sm"
                      colorScheme="purple"
                      onClick={handleAddShippingPoint}
                    >
                      Add
                    </Button>
                  </Flex>

                  <Flex wrap="wrap" gap={2}>
                    {shippingPoints.length === 0 && (
                      <Text fontSize="xs" color="gray.400">
                        Abhi koi shipping/return point add nahi hua hai.
                      </Text>
                    )}

                    {shippingPoints.map((point, idx) => (
                      <Tag
                        key={idx}
                        borderRadius="full"
                        variant="subtle"
                        colorScheme="blue"
                      >
                        <TagLabel>{point}</TagLabel>
                        <TagCloseButton
                          onClick={() => handleRemoveShippingPoint(idx)}
                        />
                      </Tag>
                    ))}
                  </Flex>
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* SEO */}
              <Heading size="md" mb={3}>
                SEO Settings
              </Heading>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Meta Title</FormLabel>
                  <Input
                    {...register("metaTitle")}
                    placeholder="Best padded bra for everyday comfort | HOI"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Meta Description</FormLabel>
                  <Textarea
                    {...register("metaDescription")}
                    rows={2}
                    placeholder="Shop ultra-comfortable padded bras with full coverage, perfect for daily wear..."
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2]} gap={4} mt={4}>
                <FormControl>
                  <FormLabel>SEO Keywords</FormLabel>
                  <Input
                    {...register("seoKeywords")}
                    placeholder="padded bra, seamless bra, cotton bra"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Comma separated – ye focus keywords rahenge.
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Schema Markup (JSON-LD)</FormLabel>
                  <Textarea
                    {...register("seoSchema")}
                    rows={4}
                    placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                  />
                </FormControl>
              </SimpleGrid>

              <Flex justify="flex-end" mt={8} gap={3}>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit">
                  Update Product
                </Button>
              </Flex>
            </form>
          </Box>

          {/* RIGHT: LIVE PREVIEW CARD */}
          <Box
            flex="1.4"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={4}
            boxShadow="sm"
            position="sticky"
            top="80px"
            h="fit-content"
          >
            <Text fontSize="sm" fontWeight="600" color="gray.500" mb={3}>
              Live Preview
            </Text>

            <Box
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              {/* Image Preview */}
              <Box
                h="350px"
                bgGradient="linear(to-br, purple.100, pink.100)"
                position="relative"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={nameWatch}
                    objectFit="cover"
                    objectPosition="top"
                    w="100%"
                    h="100%"
                  />
                ) : (
                  <Flex
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                    direction="column"
                    gap={1}
                    color="gray.500"
                  >
                    <Text fontSize="xs">Main image preview</Text>
                    <Text fontSize="xs">Upload image to see here</Text>
                  </Flex>
                )}

                {isFeaturedWatch && (
                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    colorScheme="pink"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="0.6rem"
                  >
                    Featured
                  </Badge>
                )}
              </Box>

              <Box p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="gray.500">
                  {brandWatch} • {categoryWatch}
                </Text>
                <Heading size="sm" mt={1} mb={2}>
                  {nameWatch}
                </Heading>

                <Flex align="center" gap={2} mb={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    ₹{salePrice || mrp || 0}
                  </Text>
                  {discount > 0 && (
                    <>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textDecor="line-through"
                      >
                        ₹{mrp || 0}
                      </Text>
                      <Badge colorScheme="green" fontSize="xs">
                        {discount}% OFF
                      </Badge>
                    </>
                  )}
                </Flex>

                {colorsWatch && (
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Colors: {colorsWatch}
                  </Text>
                )}

                {tagsWatch && (
                  <Text fontSize="xs" color="gray.400">
                    Tags: {tagsWatch}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default EditProducts;
